package emailtemplatehandler

import "github.com/go-chi/chi/v5"

func (h *EmailTemplateHandler) Routes(r chi.Router) {
	r.Get("/", h.List)
	r.Post("/", h.Create)
	r.Get("/{id}", h.Get)
	r.Put("/{id}", h.Update)
	r.Delete("/{id}", h.SoftDelete)
}
