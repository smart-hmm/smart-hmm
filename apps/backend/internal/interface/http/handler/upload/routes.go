package uploadhandler

import "github.com/go-chi/chi/v5"

func (h *UploadHandler) Routes(r chi.Router) {
	r.Post("/presign", h.Presign)
}
