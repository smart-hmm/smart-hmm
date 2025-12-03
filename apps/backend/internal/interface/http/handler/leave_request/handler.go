package leaverequesthandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	leaverequestdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_request/dto"
	leaveusecase "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type LeaveRequestHandler struct {
	CreateUC     *leaveusecase.CreateLeaveRequestUsecase
	GetUC        *leaveusecase.GetLeaveRequest
	ListByEmpUC  *leaveusecase.ListByEmployee
	ListByStatus *leaveusecase.ListByStatus
	ApproveUC    *leaveusecase.ApproveLeaveUsecase
	RejectUC     *leaveusecase.RejectLeaveUsecase
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewLeaveRequestHandler(
	createUC *leaveusecase.CreateLeaveRequestUsecase,
	getUC *leaveusecase.GetLeaveRequest,
	listByEmpUC *leaveusecase.ListByEmployee,
	listByStatus *leaveusecase.ListByStatus,
	approveUC *leaveusecase.ApproveLeaveUsecase,
	rejectUC *leaveusecase.RejectLeaveUsecase,
) *LeaveRequestHandler {
	return &LeaveRequestHandler{
		CreateUC:     createUC,
		GetUC:        getUC,
		ListByStatus: listByStatus,
		ListByEmpUC:  listByEmpUC,
		ApproveUC:    approveUC,
		RejectUC:     rejectUC,
	}
}

func (h *LeaveRequestHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body leaverequestdto.CreateLeaveRequestRequest

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req, err := h.CreateUC.Execute(r.Context(), body.EmployeeID, body.LeaveTypeID, body.Reason, body.StartDate, body.EndDate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, req, http.StatusCreated)
}

func (h *LeaveRequestHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	req, err := h.GetUC.Execute(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if req == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, req, http.StatusOK)
}

func (h *LeaveRequestHandler) Approve(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var body struct {
		ApprovedBy string `json:"approved_by" validate:"required"`
	}

	json.NewDecoder(r.Body).Decode(&body)

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	request, err := h.GetUC.Execute(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if request == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	err = h.ApproveUC.Execute(r.Context(), request, body.ApprovedBy)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *LeaveRequestHandler) Reject(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var body leaverequestdto.RejectLeaveRequestRequest

	json.NewDecoder(r.Body).Decode(&body)

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	request, err := h.GetUC.Execute(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if request == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	err = h.RejectUC.Execute(r.Context(), request, body.RejectedBy, body.Reason)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
