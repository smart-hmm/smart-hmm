package payrollusecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/smart-hmm/smart-hmm/internal/modules/payroll/domain"
	payrollrepository "github.com/smart-hmm/smart-hmm/internal/modules/payroll/repository"
)

type GeneratePayrollUsecase struct {
	repo payrollrepository.PayrollRepository
}

func NewGeneratePayrollUsecase(repo payrollrepository.PayrollRepository) *GeneratePayrollUsecase {
	return &GeneratePayrollUsecase{repo: repo}
}

func (uc *GeneratePayrollUsecase) Execute(
	ctx context.Context,
	employeeID string,
	period string,
	baseSalary float64,
	allowances map[string]float64,
	deductions map[string]float64,
) (*domain.PayrollRecord, error) {
	record, err := domain.NewPayrollRecord(
		uuid.NewString(),
		employeeID,
		period,
		baseSalary,
		allowances,
		deductions,
		time.Now().UTC(),
	)
	if err != nil {
		return nil, err
	}

	record.UpdateNetSalary()

	err = uc.repo.Create(record)
	if err != nil {
		return nil, err
	}

	return record, nil
}
