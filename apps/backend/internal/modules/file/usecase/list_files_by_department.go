package fileusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/file/domain"
	filerepository "github.com/smart-hmm/smart-hmm/internal/modules/file/repository"
)

type ListFilesByDepartmentUsecase struct {
	repo filerepository.FileRepository
}

func NewListFilesByDepartmentUsecase(repo filerepository.FileRepository) *ListFilesByDepartmentUsecase {
	return &ListFilesByDepartmentUsecase{
		repo: repo,
	}
}

func (uc *ListFilesByDepartmentUsecase) Execute(
	ctx context.Context,
	departmentID string,
) ([]*domain.File, error) {
	return uc.repo.ListByDepartment(ctx, departmentID)
}
