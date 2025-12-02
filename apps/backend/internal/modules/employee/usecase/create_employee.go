package employeeusecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
	employeerepository "github.com/smart-hmm/smart-hmm/internal/modules/employee/repository"
)

type CreateEmployeeUsecase struct {
	repo employeerepository.EmployeeRepository
}

func NewCreateEmployeeUsecase(repo employeerepository.EmployeeRepository) *CreateEmployeeUsecase {
	return &CreateEmployeeUsecase{repo: repo}
}

func (uc *CreateEmployeeUsecase) Execute(ctx context.Context, e *domain.Employee) (*domain.Employee, error) {
	e.ID = uuid.NewString()
	e.CreatedAt = time.Now()
	e.UpdatedAt = time.Now()
	return e, uc.repo.Create(e)
}
