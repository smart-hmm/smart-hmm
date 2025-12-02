package departmentusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/department/domain"
	departmentrepository "github.com/smart-hmm/smart-hmm/internal/modules/department/repository"
)

type CreateDepartmentUsecase struct {
	repo departmentrepository.DepartmentRepository
}

func NewCreateDepartmentUsecase(repo departmentrepository.DepartmentRepository) *CreateDepartmentUsecase {
	return &CreateDepartmentUsecase{repo: repo}
}

func (uc *CreateDepartmentUsecase) Execute(ctx context.Context, name string, managerID *string) (*domain.Department, error) {
	newDep, err := domain.NewDepartment(name, managerID)
	if err != nil {
		return nil, err
	}
	return newDep, uc.repo.Create(newDep)
}
