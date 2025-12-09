package fileusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/file/domain"
	filerepository "github.com/smart-hmm/smart-hmm/internal/modules/file/repository"
	storageusecase "github.com/smart-hmm/smart-hmm/internal/modules/storage/usecase"
)

type GetFileUsecase struct {
	repo                      filerepository.FileRepository
	getPresignedDownloadURLUC *storageusecase.GetPresignedDownloadURLUsecase
}

func NewGetFileUsecase(
	repo filerepository.FileRepository,
	getPresignedDownloadURLUC *storageusecase.GetPresignedDownloadURLUsecase) *GetFileUsecase {
	return &GetFileUsecase{
		repo:                      repo,
		getPresignedDownloadURLUC: getPresignedDownloadURLUC,
	}
}

func (uc *GetFileUsecase) Execute(ctx context.Context, id string) (*domain.File, string, error) {
	file, err := uc.repo.GetByID(ctx, id)
	if err != nil {
		return nil, "", err
	}

	downloadURL, err := uc.getPresignedDownloadURLUC.Execute(ctx, file.StoragePath)
	if err != nil {
		downloadURL = ""
	}

	return file, downloadURL, nil
}
