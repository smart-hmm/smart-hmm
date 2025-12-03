package leaverequesthandler

import "github.com/go-chi/chi/v5"

func (h *LeaveRequestHandler) Routes(r chi.Router) {
	r.Put("/{id}/approve", h.Approve)
	r.Put("/{id}/reject", h.Reject)
	r.Post("/", h.Create)
	r.Get("/{id}", h.Get)
}
