package departmentusecase

import (
	"context"
	"errors"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/department/domain"
	departmentrepository "github.com/smart-hmm/smart-hmm/internal/modules/department/repository"
)

type UpdateDepartmentUsecase struct {
	repo departmentrepository.DepartmentRepository
}

func NewUpdateDepartmentUsecase(repo departmentrepository.DepartmentRepository) *UpdateDepartmentUsecase {
	return &UpdateDepartmentUsecase{repo: repo}
}

func (uc *UpdateDepartmentUsecase) Execute(ctx context.Context, d *domain.Department) error {
	if d.Name == "" {
		return errors.New("name required")
	}

	d.UpdatedAt = time.Now()
	return uc.repo.Update(d)
}
