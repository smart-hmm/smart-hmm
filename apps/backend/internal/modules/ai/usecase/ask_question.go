package aiusecase

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"strings"

	"github.com/Knetic/govaluate"
	aido "github.com/smart-hmm/smart-hmm/internal/modules/ai/domain"
	docrepo "github.com/smart-hmm/smart-hmm/internal/modules/document/domain"
	documentrepository "github.com/smart-hmm/smart-hmm/internal/modules/document/repository"
)

type AskQuestionUseCase struct {
	docRepo documentrepository.DocumentRepository
	embedUC *EmbedChunkUseCase
	llm     aido.LLM
}

type AskQuestionInput struct {
	Question   string
	MaxChunks  int
	SystemHint string
}

type AskQuestionOutput struct {
	Answer string          `json:"answer"`
	Chunks []docrepo.Chunk `json:"chunks"`
}

func NewAskQuestionUseCase(
	docRepo documentrepository.DocumentRepository,
	embedUC *EmbedChunkUseCase,
	llm aido.LLM,
) *AskQuestionUseCase {
	return &AskQuestionUseCase{docRepo, embedUC, llm}
}

func (uc *AskQuestionUseCase) Execute(ctx context.Context, in AskQuestionInput) (*AskQuestionOutput, error) {
	// 1) Embed câu hỏi
	qEmb, err := uc.embedUC.Execute(ctx, in.Question)
	if err != nil {
		return nil, err
	}

	// 2) Lấy các chunk liên quan
	chunks, err := uc.docRepo.SearchChunks(ctx, qEmb, 8, 0.35)
	if err != nil {
		return nil, err
	}

	if len(chunks) == 0 {
		chunks, _ = uc.docRepo.SearchChunks(ctx, qEmb, 8, 0.38)
	}

	if len(chunks) == 0 {
		return &AskQuestionOutput{
			Answer: "Tôi không tìm thấy chính sách liên quan trong tài liệu hiện tại.",
			Chunks: nil,
		}, nil
	}

	var sb strings.Builder
	for i, c := range chunks {
		sb.WriteString(fmt.Sprintf("[%d] %s\n\n", i+1, c.Content))
	}
	contextText := sb.String()

	// 3) System prompt: LLM chỉ được trích xuất công thức + biến
	system := `
Bạn là trợ lý HR nội bộ.

NHIỆM VỤ:
- Dựa trên CONTEXT, trích xuất công thức tính toán và các biến liên quan.
- KHÔNG được tự sáng tác công thức hoặc chính sách mới ngoài những gì ghi trong tài liệu.

BẠN CHỈ ĐƯỢC TRẢ VỀ JSON VỚI FORMAT:

{
  "explanation": "Giải thích rule trong tài liệu, bằng tiếng Việt",
  "formula_expression": "biểu_thức_toán_học",
  "variables": {
      "monthsWorked": 36,
      "salary": 100000000
  },
  "unit": "months_of_salary" | "VND" | "days" | "hours" | "number"
}

QUY TẮC:
- "formula_expression" phải là biểu thức toán học hợp lệ cho govaluate.
- Có thể dùng: + - * / ( ) và các biến.
- Có thể dùng các hàm: if(cond, then, else), max(a,b), min(a,b), floor(x), ceil(x), round(x)
- KHÔNG được thay đổi logic so với tài liệu.
- Nếu không có công thức, đặt "formula_expression": null và chỉ giải thích policy.

Chỉ trả JSON. KHÔNG được in text ngoài JSON.
`
	if in.SystemHint != "" {
		system += "\n" + in.SystemHint
	}

	user := fmt.Sprintf(`
CONTEXT:
%s

QUESTION:
%s

Hãy trả về JSON đúng format trên. KHÔNG VIẾT GÌ NGOÀI JSON.
`, contextText, in.Question)

	// 4) Gọi LLM để lấy JSON structured
	raw, err := uc.llm.Generate(ctx, system, user)
	if err != nil {
		return nil, err
	}

	answerJSON := make(map[string]any)
	if err := json.Unmarshal([]byte(raw), &answerJSON); err != nil {
		// JSON hỏng → fallback: trả luôn raw text cho user (đỡ crash)
		natural := "Xin lỗi, tôi không phân tích được chính sách từ tài liệu."
		return &AskQuestionOutput{
			Answer: natural,
			Chunks: chunks,
		}, nil
	}

	explanation, _ := answerJSON["explanation"].(string)
	formulaExp, _ := answerJSON["formula_expression"].(string)
	variables, _ := answerJSON["variables"].(map[string]any)
	unit, _ := answerJSON["unit"].(string)

	// 5) Evaluate công thức bằng govaluate (cho chắc toán đúng)
	var computedResult any = nil
	if formulaExp != "" && formulaExp != "null" && variables != nil {
		functions := map[string]govaluate.ExpressionFunction{
			"if": func(args ...interface{}) (interface{}, error) {
				if len(args) != 3 {
					return nil, fmt.Errorf("if() expects 3 args")
				}
				cond, ok := args[0].(bool)
				if !ok {
					return nil, fmt.Errorf("if() condition must be bool")
				}
				if cond {
					return args[1], nil
				}
				return args[2], nil
			},
			"max": func(args ...interface{}) (interface{}, error) {
				a := toFloat(args[0])
				b := toFloat(args[1])
				return math.Max(a, b), nil
			},
			"min": func(args ...interface{}) (interface{}, error) {
				a := toFloat(args[0])
				b := toFloat(args[1])
				return math.Min(a, b), nil
			},
			"floor": func(args ...interface{}) (interface{}, error) {
				return math.Floor(toFloat(args[0])), nil
			},
			"ceil": func(args ...interface{}) (interface{}, error) {
				return math.Ceil(toFloat(args[0])), nil
			},
			"round": func(args ...interface{}) (interface{}, error) {
				return math.Round(toFloat(args[0])), nil
			},
		}

		expr, err := govaluate.NewEvaluableExpressionWithFunctions(formulaExp, functions)
		if err == nil {
			if result, err := expr.Evaluate(variables); err == nil {
				computedResult = result
			}
		}
	}

	// 6) Build câu trả lời natural language ở backend (dựa trên explanation + computedResult)
	natural := buildNaturalAnswer(explanation, formulaExp, variables, unit, computedResult, in.Question)

	return &AskQuestionOutput{
		Answer: natural,
		Chunks: chunks,
	}, nil
}

// helper: convert any -> float64
func toFloat(v interface{}) float64 {
	switch n := v.(type) {
	case float64:
		return n
	case float32:
		return float64(n)
	case int:
		return float64(n)
	case int64:
		return float64(n)
	case json.Number:
		f, _ := n.Float64()
		return f
	default:
		return 0
	}
}

// buildNaturalAnswer: nơi bạn kiểm soát hoàn toàn cách nói chuyện với user
func buildNaturalAnswer(
	explanation string,
	formulaExp string,
	variables map[string]any,
	unit string,
	computedResult any,
	question string,
) string {
	// Nếu không có công thức hoặc không tính được → trả explanation thuần
	if formulaExp == "" || formulaExp == "null" || computedResult == nil {
		if explanation == "" {
			return "Tôi chỉ tìm thấy mô tả chính sách chung, không đủ thông tin để tính toán chi tiết cho câu hỏi này."
		}
		return explanation
	}

	// Cast result sang float64 nếu được
	resultFloat := toFloat(computedResult)

	// Lấy thêm vài biến hữu ích
	monthsWorked := toFloat(variables["monthsWorked"])
	salary := toFloat(variables["salary"])

	// Trường hợp đặc biệt: unit = "months_of_salary" và có salary
	if unit == "months_of_salary" && salary > 0 {
		totalAmount := resultFloat * salary
		return fmt.Sprintf(
			"%s\n\nÁp dụng vào câu hỏi của bạn:\n- Thời gian làm việc: %.0f tháng\n- Công thức: %s\n→ Kết quả: bạn được thưởng khoảng %.2f tháng lương.\nVới mức lương hiện tại ~%.0f mỗi tháng, số tiền thưởng ước tính khoảng %.0f.",
			explanation,
			monthsWorked,
			formulaExp,
			resultFloat,
			salary,
			totalAmount,
		)
	}

	// Các unit khác (VND, days, hours, number...)
	if unit == "VND" {
		return fmt.Sprintf(
			"%s\n\nKết quả tính toán theo công thức: khoảng %.0f VND.",
			explanation,
			resultFloat,
		)
	}

	if unit == "days" {
		return fmt.Sprintf(
			"%s\n\nKết quả tính toán: khoảng %.0f ngày.",
			explanation,
			resultFloat,
		)
	}

	// fallback general
	return fmt.Sprintf(
		"%s\n\nKết quả tính toán theo công thức: %.2f %s.",
		explanation,
		resultFloat,
		unit,
	)
}
