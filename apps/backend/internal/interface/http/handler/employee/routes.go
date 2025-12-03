package employeehandler

import "github.com/go-chi/chi/v5"

func (h *EmployeeHandler) Routes(r chi.Router) {
	r.Post("/onboard", h.Onboard)
	r.Post("/", h.Create)
	r.Get("/department/{departmentId}", h.ListByDepartment)
	r.Get("/", h.List)
	r.Get("/{id}", h.Get)
	r.Put("/{id}", h.Update)
}
