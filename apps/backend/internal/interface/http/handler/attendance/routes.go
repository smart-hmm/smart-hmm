package attendancehandler

import "github.com/go-chi/chi/v5"

func (h *AttendanceHandler) Routes(r chi.Router) {
	r.Post("/{employeeId}/clock-in", h.ClockIn)
	r.Post("/{employeeId}/clock-out", h.ClockOut)
	r.Get("/{employeeId}", h.ListByEmployee)
	r.Get("/{employeeId}/{recordId}", h.GetOne)
}
