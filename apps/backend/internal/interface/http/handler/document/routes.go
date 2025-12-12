package documenthandler

import "github.com/go-chi/chi/v5"

func (h *DocumentHandler) Routes(r chi.Router) {
	r.Post("/ingest-text", h.IngestText)
}
