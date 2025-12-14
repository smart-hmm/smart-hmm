package metadatahandler

import "github.com/go-chi/chi/v5"

func (h *MetadataHandler) Routes(r chi.Router) {
	r.Get("/tenant", h.Get)
}
