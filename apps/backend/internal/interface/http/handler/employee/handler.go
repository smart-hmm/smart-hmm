package employeehandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	employeehandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/employee/dto"
	"github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
	employeerepository "github.com/smart-hmm/smart-hmm/internal/modules/employee/repository"
	employeeusecase "github.com/smart-hmm/smart-hmm/internal/modules/employee/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type EmployeeHandler struct {
	CreateUC  *employeeusecase.CreateEmployeeUsecase
	UpdateUC  *employeeusecase.UpdateEmployeeUsecase
	OnboardUC *employeeusecase.OnboardEmployeeUsecase
	Repo      employeerepository.EmployeeRepository
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewEmployeeHandler(
	createUC *employeeusecase.CreateEmployeeUsecase,
	updateUC *employeeusecase.UpdateEmployeeUsecase,
	onboardUC *employeeusecase.OnboardEmployeeUsecase,
	repo employeerepository.EmployeeRepository,
) *EmployeeHandler {
	return &EmployeeHandler{
		CreateUC:  createUC,
		UpdateUC:  updateUC,
		OnboardUC: onboardUC,
		Repo:      repo,
	}
}

func (h *EmployeeHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body employeehandlerdto.CreateEmployeeRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	e := &domain.Employee{
		Code:       body.Code,
		FirstName:  body.FirstName,
		LastName:   body.LastName,
		Email:      body.Email,
		BaseSalary: body.BaseSalary,
	}

	created, err := h.CreateUC.Execute(r.Context(), e)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, created, http.StatusCreated)
}

func (h *EmployeeHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var body employeehandlerdto.UpdateEmployeeRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	e := &domain.Employee{
		ID:               id,
		Code:             body.Code,
		FirstName:        body.FirstName,
		LastName:         body.LastName,
		Email:            body.Email,
		Phone:            body.Phone,
		DateOfBirth:      body.DateOfBirth,
		DepartmentID:     body.DepartmentID,
		ManagerID:        body.ManagerID,
		Position:         body.Position,
		EmploymentType:   body.EmploymentType,
		EmploymentStatus: body.EmploymentStatus,
		JoinDate:         body.JoinDate,
		BaseSalary:       body.BaseSalary,
	}

	if err := h.UpdateUC.Execute(r.Context(), e); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *EmployeeHandler) Onboard(w http.ResponseWriter, r *http.Request) {
	var body employeehandlerdto.OnboardEmployeeRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := h.OnboardUC.Execute(r.Context(), employeeusecase.OnboardEmployeeInput{
		Code:       body.Code,
		FirstName:  body.FirstName,
		LastName:   body.LastName,
		Email:      body.Email,
		BaseSalary: body.BaseSalary,
		CreateUser: body.CreateUser,
		UserEmail:  body.UserEmail,
		Password:   body.Password,
		Role:       body.Role,
		Phone:      body.Phone,
		Position:   body.Position,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *EmployeeHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	emp, err := h.Repo.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if emp == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, emp, http.StatusOK)
}

func (h *EmployeeHandler) List(w http.ResponseWriter, r *http.Request) {
	employees, err := h.Repo.ListAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, employees, http.StatusOK)
}

func (h *EmployeeHandler) ListByDepartment(w http.ResponseWriter, r *http.Request) {
	deptID := chi.URLParam(r, "departmentId")

	employees, err := h.Repo.ListByDepartment(deptID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, employees, http.StatusOK)
}
