package fileusecase

import (
	"context"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/file/domain"
	filerepository "github.com/smart-hmm/smart-hmm/internal/modules/file/repository"
)

type ConfirmUploadUsecase struct {
	repo filerepository.FileRepository
}

func NewConfirmUploadUsecase(repo filerepository.FileRepository) *ConfirmUploadUsecase {
	return &ConfirmUploadUsecase{repo}
}

type ConfirmUploadInput struct {
	DepartmentID string
	StoragePath  string

	Filename    string
	ContentType string
	Size        int64

	UploadedBy string
}

func (uc *ConfirmUploadUsecase) Execute(
	ctx context.Context,
	in ConfirmUploadInput,
) (*domain.File, error) {

	file := &domain.File{
		DepartmentID: &in.DepartmentID,

		StoragePath: in.StoragePath,
		Filename:    in.Filename,
		ContentType: in.ContentType,
		Size:        in.Size,

		CreatedAt:  time.Now().UTC(),
		UploadedBy: &in.UploadedBy,
	}

	if err := uc.repo.Create(ctx, file); err != nil {
		return nil, err
	}

	return file, nil
}
