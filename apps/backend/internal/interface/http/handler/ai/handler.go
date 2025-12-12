package aihandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	aidto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/ai/dto"
	aiusecase "github.com/smart-hmm/smart-hmm/internal/modules/ai/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type AIHandler struct {
	AskQuestionUsecase *aiusecase.AskQuestionUseCase
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewAIHandler(
	askUC *aiusecase.AskQuestionUseCase,
) *AIHandler {
	return &AIHandler{
		AskQuestionUsecase: askUC,
	}
}

func (h *AIHandler) Ask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store")

	var body aidto.AskRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		httpx.WriteJSON(w, map[string]any{
			"error": err.Error(),
		}, http.StatusBadRequest)
		return
	}

	if body.MaxChunks <= 0 {
		body.MaxChunks = 5
	}

	result, err := h.AskQuestionUsecase.Execute(r.Context(), aiusecase.AskQuestionInput{
		Question:   body.Question,
		MaxChunks:  body.MaxChunks,
		SystemHint: body.SystemHint,
	})
	if err != nil {
		httpx.WriteJSON(w, map[string]any{
			"error": err.Error(),
		}, http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, result, http.StatusOK)
}
