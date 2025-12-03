package payrollhandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	payrollhandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/payroll/dto"
	payrollrepository "github.com/smart-hmm/smart-hmm/internal/modules/payroll/repository"
	payrollusecase "github.com/smart-hmm/smart-hmm/internal/modules/payroll/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type PayrollHandler struct {
	GenerateUC *payrollusecase.GeneratePayrollUsecase
	Repo       payrollrepository.PayrollRepository
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewPayrollHandler(generateUC *payrollusecase.GeneratePayrollUsecase, repo payrollrepository.PayrollRepository) *PayrollHandler {
	return &PayrollHandler{
		GenerateUC: generateUC,
		Repo:       repo,
	}
}

func (h *PayrollHandler) Generate(w http.ResponseWriter, r *http.Request) {
	var body payrollhandlerdto.GeneratePayrollRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	record, err := h.GenerateUC.Execute(
		r.Context(),
		body.EmployeeID,
		body.Period,
		body.BaseSalary,
		body.Allowances,
		body.Deductions,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, record, http.StatusCreated)
}

func (h *PayrollHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	record, err := h.Repo.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if record == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, record, http.StatusOK)
}

func (h *PayrollHandler) ListByEmployee(w http.ResponseWriter, r *http.Request) {
	employeeID := chi.URLParam(r, "employeeId")

	records, err := h.Repo.ListByEmployee(employeeID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, records, http.StatusOK)
}

func (h *PayrollHandler) ListByPeriod(w http.ResponseWriter, r *http.Request) {
	period := chi.URLParam(r, "period")

	records, err := h.Repo.ListByPeriod(period)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, records, http.StatusOK)
}
