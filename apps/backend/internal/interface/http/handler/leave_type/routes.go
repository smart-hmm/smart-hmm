package leavetypehandler

import "github.com/go-chi/chi/v5"

func (h *LeaveTypeHandler) Routes(r chi.Router) {
	r.Get("/", h.List)
	r.Get("/{id}", h.Get)
	r.Post("/", h.Create)
	r.Put("/{id}", h.Update)
}
