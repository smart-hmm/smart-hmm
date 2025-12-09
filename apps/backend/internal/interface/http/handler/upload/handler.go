package uploadhandler

import (
	"encoding/json"
	"net/http"
	"time"

	storageusecase "github.com/smart-hmm/smart-hmm/internal/modules/storage/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/authctx"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type UploadHandler struct {
	GenPresignUC *storageusecase.GenPresignedURLUsecase
}

func NewUploadHandler(
	genPresignUC *storageusecase.GenPresignedURLUsecase,
) *UploadHandler {
	return &UploadHandler{
		GenPresignUC: genPresignUC,
	}
}

func (h *UploadHandler) Presign(w http.ResponseWriter, r *http.Request) {
	userId, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	_ = userId

	var body struct {
		Path        string `json:"path"`
		ContentType string `json:"contentType"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if body.Path == "" {
		http.Error(w, "path is required", http.StatusBadRequest)
		return
	}

	url, err := h.GenPresignUC.Execute(
		r.Context(),
		body.Path,
		"PUT",
		body.ContentType,
		5*time.Minute,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, map[string]string{
		"url": url,
	}, http.StatusOK)
}
