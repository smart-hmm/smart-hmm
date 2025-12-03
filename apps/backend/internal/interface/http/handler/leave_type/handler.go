package leavetypehandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	leavehandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_type/dto"
	leavetypehandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_type/dto"
	"github.com/smart-hmm/smart-hmm/internal/modules/leave_type/domain"
	leaverepo "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/repository"
	leavetypeusecase "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type LeaveTypeHandler struct {
	ListAllUC    *leavetypeusecase.ListAllLeaveTypesUsecase
	GetUC        *leavetypeusecase.GetLeaveTypeUsecase
	CreateUC     *leavetypeusecase.CreateLeaveTypeUsecase
	UpdateUC     *leavetypeusecase.UpdateLeaveTypeUsecase
	SoftDeleteUC *leavetypeusecase.SoftDeleteLeaveTypeUsecase

	Repo leaverepo.LeaveTypeRepository
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewLeaveTypeHandler(
	listAllUC *leavetypeusecase.ListAllLeaveTypesUsecase,
	getUC *leavetypeusecase.GetLeaveTypeUsecase,
	createUC *leavetypeusecase.CreateLeaveTypeUsecase,
	updateUC *leavetypeusecase.UpdateLeaveTypeUsecase,
	softDeleteUC *leavetypeusecase.SoftDeleteLeaveTypeUsecase,
	repo leaverepo.LeaveTypeRepository,
) *LeaveTypeHandler {
	return &LeaveTypeHandler{
		ListAllUC:    listAllUC,
		GetUC:        getUC,
		CreateUC:     createUC,
		UpdateUC:     updateUC,
		SoftDeleteUC: softDeleteUC,

		Repo: repo,
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

	httpx.WriteJSON(w, lt, http.StatusOK)
}

func (h *LeaveTypeHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var body leavetypehandlerdto.UpdateLeaveTypeRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
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

	if err := validate.Struct(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := h.CreateUC.Execute(r.Context(), req.Name, req.DefaultDays, req.IsPaid)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	json.NewEncoder(w).Encode(result)
}

func (h *LeaveTypeHandler) SoftDelete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	err := h.SoftDeleteUC.Execute(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
