package employeeusecase

import (
	"context"

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
	newEmp, err := domain.NewEmployee(e.Code, e.FirstName, e.LastName, e.Email, e.BaseSalary)
	if err != nil {
		return nil, err
	}
	return newEmp, uc.repo.Create(newEmp)
}
