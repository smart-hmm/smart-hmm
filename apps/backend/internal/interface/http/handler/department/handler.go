package departmenthandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	departmenthandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/department/dto"
	"github.com/smart-hmm/smart-hmm/internal/modules/department/domain"
	departmentrepository "github.com/smart-hmm/smart-hmm/internal/modules/department/repository"
	departmentusecase "github.com/smart-hmm/smart-hmm/internal/modules/department/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type DepartmentHandler struct {
	CreateUC *departmentusecase.CreateDepartmentUsecase
	UpdateUC *departmentusecase.UpdateDepartmentUsecase
	Repo     departmentrepository.DepartmentRepository
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewDepartmentHandler(
	createUC *departmentusecase.CreateDepartmentUsecase,
	updateUC *departmentusecase.UpdateDepartmentUsecase,
	repo departmentrepository.DepartmentRepository,
) *DepartmentHandler {
	return &DepartmentHandler{
		CreateUC: createUC,
		UpdateUC: updateUC,
		Repo:     repo,
	}
}

func (h *DepartmentHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body departmenthandlerdto.CreateDepartmentRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	dept, err := h.CreateUC.Execute(r.Context(), body.Name, body.ManagerID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, dept, http.StatusCreated)
}

func (h *DepartmentHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var body departmenthandlerdto.UpdateDepartmentRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	dept := &domain.Department{
		ID:        id,
		Name:      body.Name,
		ManagerID: body.ManagerID,
	}

	if err := h.UpdateUC.Execute(r.Context(), dept); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *DepartmentHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	dept, err := h.Repo.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if dept == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, dept, http.StatusOK)
}

func (h *DepartmentHandler) List(w http.ResponseWriter, r *http.Request) {
	depts, err := h.Repo.ListAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, depts, http.StatusOK)
}
