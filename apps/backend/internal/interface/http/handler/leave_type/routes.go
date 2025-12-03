package leavetypehandler

import "github.com/go-chi/chi/v5"

func (h *LeaveTypeHandler) Routes(r chi.Router) {
	r.Get("/", h.List)
	r.Post("/", h.Create)
	r.Get("/{id}", h.Get)
	r.Put("/{id}", h.Update)
	r.Delete("/{id}", h.SoftDelete)
}
