package metadatahandler

import (
	"net/http"

	metadatausecase "github.com/smart-hmm/smart-hmm/internal/modules/metadata/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type MetadataHandler struct {
	GetTenantMetadataUseCase *metadatausecase.GetTenantMetadataUseCase
}

func NewMetadataHandler(
	getTenantMetadataUseCase *metadatausecase.GetTenantMetadataUseCase,
) *MetadataHandler {
	return &MetadataHandler{GetTenantMetadataUseCase: getTenantMetadataUseCase}
}

func (h *MetadataHandler) Get(w http.ResponseWriter, r *http.Request) {
	metadata := h.GetTenantMetadataUseCase.Execute()
	// w.Header().Set("Cache-Control", "public, max-age=3600")
	httpx.WriteJSON(w, metadata, http.StatusOK)
}
