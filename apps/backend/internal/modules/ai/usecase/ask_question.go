package aiusecase

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"strings"

	"github.com/Knetic/govaluate"

	aido "github.com/smart-hmm/smart-hmm/internal/modules/ai/domain"
	docdomain "github.com/smart-hmm/smart-hmm/internal/modules/document/domain"
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
	Answer string            `json:"answer"`
	Chunks []docdomain.Chunk `json:"chunks"`
}

func NewAskQuestionUseCase(
	docRepo documentrepository.DocumentRepository,
	embedUC *EmbedChunkUseCase,
	llm aido.LLM,
) *AskQuestionUseCase {
	return &AskQuestionUseCase{
		docRepo: docRepo,
		embedUC: embedUC,
		llm:     llm,
	}
}

func (uc *AskQuestionUseCase) Execute(
	ctx context.Context,
	in AskQuestionInput,
) (*AskQuestionOutput, error) {
	qEmbedding, err := uc.embedUC.Execute(ctx, in.Question)
	if err != nil {
		return nil, err
	}

	k := in.MaxChunks
	if k <= 0 {
		k = 5
	}

	chunks, err := uc.docRepo.SearchChunks(ctx, qEmbedding, k)
	if err != nil {
		return nil, err
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

	system := `
Bạn là trợ lý nhân sự (HR) nội bộ.

NGUYÊN TẮC BẮT BUỘC:
- CHỈ sử dụng thông tin trong CONTEXT.
- KHÔNG suy diễn hoặc tự tạo chính sách ngoài tài liệu.
- Nếu không đủ thông tin, hãy trả lời rõ ràng là không tìm thấy.

NHIỆM VỤ:
- Nếu tài liệu có công thức tính toán: trích xuất công thức và các biến.
- Nếu KHÔNG có công thức: chỉ giải thích chính sách bằng lời.

FORMAT TRẢ VỀ (JSON DUY NHẤT):

{
  "explanation": "Giải thích chính sách bằng tiếng Việt",
  "formula_expression": "biểu_thức_toán_học" | null,
  "variables": { ... } | null,
  "unit": "months_of_salary" | "VND" | "days" | "hours" | "number"
}

QUY TẮC:
- formula_expression phải hợp lệ cho govaluate.
- Được dùng: + - * / ( )
- Được dùng hàm: if(cond, a, b), max(a,b), min(a,b), floor(x), ceil(x), round(x)
- Nếu KHÔNG có công thức → formula_expression = null, variables = null
- KHÔNG in thêm text ngoài JSON.
`

	if in.SystemHint != "" {
		system += "\n" + in.SystemHint
	}

	user := fmt.Sprintf(`
CONTEXT:
%s

QUESTION:
%s

Chỉ trả về JSON đúng format trên.
`, contextText, in.Question)
	raw, err := uc.llm.Generate(ctx, system, user)
	if err != nil {
		return nil, err
	}

	var parsed struct {
		Explanation       string                 `json:"explanation"`
		FormulaExpression *string                `json:"formula_expression"`
		Variables         map[string]interface{} `json:"variables"`
		Unit              string                 `json:"unit"`
	}

	if err := json.Unmarshal([]byte(raw), &parsed); err != nil {
		return &AskQuestionOutput{
			Answer: "Tôi tìm thấy tài liệu liên quan nhưng không thể phân tích chính sách một cách chính xác.",
			Chunks: chunks,
		}, nil
	}

	var computed any = nil

	if parsed.FormulaExpression != nil &&
		*parsed.FormulaExpression != "" &&
		parsed.Variables != nil {

		expr, err := govaluate.NewEvaluableExpressionWithFunctions(
			*parsed.FormulaExpression,
			govaluateFunctions(),
		)

		if err == nil {
			if result, err := expr.Evaluate(parsed.Variables); err == nil {
				computed = result
			}
		}
	}

	answer := buildNaturalHRAnswer(
		parsed.Explanation,
		parsed.FormulaExpression,
		parsed.Variables,
		parsed.Unit,
		computed,
	)

	return &AskQuestionOutput{
		Answer: answer,
		Chunks: chunks,
	}, nil
}

func govaluateFunctions() map[string]govaluate.ExpressionFunction {
	return map[string]govaluate.ExpressionFunction{
		"if": func(args ...interface{}) (interface{}, error) {
			if len(args) != 3 {
				return nil, fmt.Errorf("if expects 3 args")
			}
			cond, ok := args[0].(bool)
			if !ok {
				return nil, fmt.Errorf("if condition must be bool")
			}
			if cond {
				return args[1], nil
			}
			return args[2], nil
		},
		"max": func(args ...interface{}) (interface{}, error) {
			return math.Max(toFloat(args[0]), toFloat(args[1])), nil
		},
		"min": func(args ...interface{}) (interface{}, error) {
			return math.Min(toFloat(args[0]), toFloat(args[1])), nil
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
}

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

func buildNaturalHRAnswer(
	explanation string,
	formula *string,
	vars map[string]interface{},
	unit string,
	result interface{},
) string {

	if formula == nil || result == nil {
		return explanation
	}

	val := toFloat(result)

	switch unit {
	case "months_of_salary":
		salary := toFloat(vars["salary"])
		total := val * salary
		return fmt.Sprintf(
			"%s\n\nÁp dụng vào trường hợp của bạn, bạn được thưởng khoảng %.2f tháng lương. Với mức lương hiện tại, số tiền thưởng ước tính khoảng %.0f.",
			explanation,
			val,
			total,
		)

	case "VND":
		return fmt.Sprintf(
			"%s\n\nSố tiền ước tính theo công thức là khoảng %.0f VND.",
			explanation,
			val,
		)

	case "days":
		return fmt.Sprintf(
			"%s\n\nSố ngày tương ứng là khoảng %.0f ngày.",
			explanation,
			val,
		)

	default:
		return fmt.Sprintf(
			"%s\n\nKết quả tính toán: %.2f.",
			explanation,
			val,
		)
	}
}
