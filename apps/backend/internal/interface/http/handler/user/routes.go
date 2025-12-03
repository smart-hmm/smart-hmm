package userhandler

import "github.com/go-chi/chi/v5"

func (h *UserHandler) Routes(r chi.Router) {
	r.Post("/", h.Register)
	r.Get("/", h.List)
	r.Get("/{id}", h.Get)
}
