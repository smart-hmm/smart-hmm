package payrollhandler

import "github.com/go-chi/chi/v5"

func (h *PayrollHandler) Routes(r chi.Router) {
	r.Post("/", h.Generate)
	r.Get("/employee/{employeeId}", h.ListByEmployee)
	r.Get("/period/{period}", h.ListByPeriod)
	r.Get("/{id}", h.Get)
}
