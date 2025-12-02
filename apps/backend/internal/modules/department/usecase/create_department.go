package departmentusecase

import (
	"context"
	"time"

	"github.com/google/uuid"
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
	d := &domain.Department{
		ID:        uuid.NewString(),
		Name:      name,
		ManagerID: managerID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	return d, uc.repo.Create(d)
}
