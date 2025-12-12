package documenthandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	documentdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/document/dto"
	documentusecase "github.com/smart-hmm/smart-hmm/internal/modules/document/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type DocumentHandler struct {
	IngestDocumentUsecase *documentusecase.IngestDocumentUseCase
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewDocumentHandler(
	ingestDocumentUsecase *documentusecase.IngestDocumentUseCase,
) *DocumentHandler {
	return &DocumentHandler{
		IngestDocumentUsecase: ingestDocumentUsecase,
	}
}

func (h *DocumentHandler) IngestText(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store")

	var body documentdto.IngestTextRequest
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

	input := documentusecase.IngestDocumentInput{
		Title:       body.Title,
		Description: body.Description,
		Source:      body.Source,
		MimeType:    body.MimeType,
		Language:    body.Language,
		Tags:        body.Tags,
		Content:     body.Content,
	}

	if err := h.IngestDocumentUsecase.Execute(r.Context(), input); err != nil {
		httpx.WriteJSON(w, map[string]any{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, map[string]any{
		"message": "document ingested successfully",
	}, http.StatusCreated)
}

// func (h *DocumentHandler) IngestFile(w http.ResponseWriter, r *http.Request) {
// 	var body documentdto.IngestFileRequest
// 	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
// 		http.Error(w, "invalid json", http.StatusBadRequest)
// 		return
// 	}

// 	if err := validate.Struct(body); err != nil {
// 		httpx.WriteJSON(w, map[string]any{"error": err.Error()}, http.StatusBadRequest)
// 		return
// 	}

// 	err := h.IngestFileUsecase.Execute(r.Context(), body)
// 	if err != nil {
// 		httpx.WriteJSON(w, map[string]any{"error": err.Error()}, http.StatusInternalServerError)
// 		return
// 	}

// 	httpx.WriteJSON(w, map[string]any{
// 		"message": "File ingested successfully",
// 	}, http.StatusCreated)
// }
