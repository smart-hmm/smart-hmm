package leavehandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	leavehandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave/dto"
	"github.com/smart-hmm/smart-hmm/internal/modules/leave/domain"
	leaverepo "github.com/smart-hmm/smart-hmm/internal/modules/leave/repository"
	leavetypesusecase "github.com/smart-hmm/smart-hmm/internal/modules/leave/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type LeaveTypeHandler struct {
	ListAllUC *leavetypesusecase.ListAllLeaveTypesUsecase
	GetUC     *leavetypesusecase.GetLeaveTypeUsecase
	CreateUC  *leavetypesusecase.CreateLeaveTypeUsecase
	UpdateUC  *leavetypesusecase.UpdateLeaveTypeUsecase

	Repo leaverepo.LeaveTypeRepository
}

func NewLeaveTypeHandler(
	listAllUC *leavetypesusecase.ListAllLeaveTypesUsecase,
	getUC *leavetypesusecase.GetLeaveTypeUsecase,
	createUC *leavetypesusecase.CreateLeaveTypeUsecase,
	updateUC *leavetypesusecase.UpdateLeaveTypeUsecase,
	repo leaverepo.LeaveTypeRepository,
) *LeaveTypeHandler {
	return &LeaveTypeHandler{
		ListAllUC: listAllUC,
		GetUC:     getUC,
		CreateUC:  createUC,
		UpdateUC:  updateUC,
		Repo:      repo,
	}
}

func (h *LeaveTypeHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	lt, err := h.GetUC.Execute(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if lt == nil {
		http.Error(w, "leave type not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, lt)
}

func (h *LeaveTypeHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var body leavehandlerdto.UpdateLeaveTypeRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	updatedData := &domain.LeaveType{
		ID:          id,
		Name:        body.Name,
		DefaultDays: body.DefaultDays,
		IsPaid:      body.IsPaid,
	}

	err := h.UpdateUC.Execute(r.Context(), updatedData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *LeaveTypeHandler) List(w http.ResponseWriter, r *http.Request) {
	result, err := h.ListAllUC.Execute(r.Context())
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	json.NewEncoder(w).Encode(result)
}

func (h *LeaveTypeHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req leavehandlerdto.CreateLeaveTypeRequest
	json.NewDecoder(r.Body).Decode(&req)

	result, err := h.CreateUC.Execute(r.Context(), req.Name, req.DefaultDays, req.IsPaid)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	json.NewEncoder(w).Encode(result)
}
