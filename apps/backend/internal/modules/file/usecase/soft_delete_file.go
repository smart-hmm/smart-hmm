package fileusecase

import (
	"context"
	"time"

	filerepository "github.com/smart-hmm/smart-hmm/internal/modules/file/repository"
)

type SoftDeleteFileUsecase struct {
	repo filerepository.FileRepository
}

func NewSoftDeleteFileUsecase(repo filerepository.FileRepository) *SoftDeleteFileUsecase {
	return &SoftDeleteFileUsecase{repo: repo}
}

func (uc *SoftDeleteFileUsecase) Execute(ctx context.Context, id string) error {
	now := time.Now()
	return uc.repo.SoftDelete(ctx, id, now)
}
