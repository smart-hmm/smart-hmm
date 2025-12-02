package attendancehandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/smart-hmm/smart-hmm/internal/modules/attendance/domain"
	attdomain "github.com/smart-hmm/smart-hmm/internal/modules/attendance/domain"
	attrepo "github.com/smart-hmm/smart-hmm/internal/modules/attendance/repository"
	attusecase "github.com/smart-hmm/smart-hmm/internal/modules/attendance/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type AttendanceHandler struct {
	ClockInUC      *attusecase.ClockInUsecase
	ClockOutUC     *attusecase.ClockOutUsecase
	AttendanceRepo attrepo.AttendanceRepository
}

func NewAttendanceHandler(
	clockInUC *attusecase.ClockInUsecase,
	clockOutUC *attusecase.ClockOutUsecase,
	repo attrepo.AttendanceRepository,
) *AttendanceHandler {
	return &AttendanceHandler{
		ClockInUC:      clockInUC,
		ClockOutUC:     clockOutUC,
		AttendanceRepo: repo,
	}
}

func (h *AttendanceHandler) ClockIn(w http.ResponseWriter, r *http.Request) {
	employeeID := chi.URLParam(r, "employeeId")

	var body struct {
		Method domain.ClockMethod `json:"method"`
		Note   *string            `json:"note"`
	}

	json.NewDecoder(r.Body).Decode(&body)

	if !body.Method.IsValid() {
		http.Error(w, "invalid method", http.StatusBadRequest)
		return
	}

	record, err := h.ClockInUC.Execute(r.Context(), employeeID, body.Method, body.Note)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, record)
}

func (h *AttendanceHandler) ClockOut(w http.ResponseWriter, r *http.Request) {
	employeeID := chi.URLParam(r, "employeeId")

	// Find last open attendance record (not clocked out)
	records, err := h.AttendanceRepo.ListByEmployee(employeeID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var open *attdomain.AttendanceRecord
	for _, rec := range records {
		if rec.ClockOut == nil {
			open = rec
			break
		}
	}

	if open == nil {
		http.Error(w, "no active clock-in found", http.StatusBadRequest)
		return
	}

	if err := h.ClockOutUC.Execute(r.Context(), open); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, open)
}

func (h *AttendanceHandler) ListByEmployee(w http.ResponseWriter, r *http.Request) {
	employeeID := chi.URLParam(r, "employeeId")

	records, err := h.AttendanceRepo.ListByEmployee(employeeID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, records)
}

func (h *AttendanceHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	recordID := chi.URLParam(r, "recordId")

	rec, err := h.AttendanceRepo.FindByID(recordID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if rec == nil {
		http.Error(w, "record not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, rec)
}
