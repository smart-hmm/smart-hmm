package employeeusecase

import (
	"context"

	employeerepository "github.com/smart-hmm/smart-hmm/internal/modules/employee/repository"
)

type DeleteEmployeeUsecase struct {
	repo employeerepository.EmployeeRepository
}

func NewDeleteEmployeeUsecase(repo employeerepository.EmployeeRepository) *DeleteEmployeeUsecase {
	return &DeleteEmployeeUsecase{repo: repo}
}

func (uc *DeleteEmployeeUsecase) Execute(ctx context.Context, id string) error {
	return uc.repo.Delete(id)
}
