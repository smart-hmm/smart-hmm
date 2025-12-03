package departmenthandler

import "github.com/go-chi/chi/v5"

func (h *DepartmentHandler) Routes(r chi.Router) {
	r.Post("/", h.Create)
	r.Get("/", h.List)
	r.Get("/{id}", h.Get)
	r.Put("/{id}", h.Update)
}
