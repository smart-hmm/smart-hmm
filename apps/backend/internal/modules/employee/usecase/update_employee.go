package employeeusecase

import (
	"context"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
	employeerepository "github.com/smart-hmm/smart-hmm/internal/modules/employee/repository"
)

type UpdateEmployeeUsecase struct {
	repo employeerepository.EmployeeRepository
}

func NewUpdateEmployeeUsecase(repo employeerepository.EmployeeRepository) *UpdateEmployeeUsecase {
	return &UpdateEmployeeUsecase{repo: repo}
}

func (uc *UpdateEmployeeUsecase) Execute(ctx context.Context, e *domain.Employee) error {
	e.UpdatedAt = time.Now().UTC()
	return uc.repo.Update(e)
}
