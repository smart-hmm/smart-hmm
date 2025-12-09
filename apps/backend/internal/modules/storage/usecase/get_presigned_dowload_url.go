package storageusecase

import (
	"context"
	"errors"
	"strings"
	"time"

	storageports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/storage"
)

type GetPresignedDownloadURLUsecase struct {
	storageSvc storageports.StorageService
}

func NewGetPresignedDownloadURLUsecase(
	storageSvc storageports.StorageService,
) *GetPresignedDownloadURLUsecase {
	return &GetPresignedDownloadURLUsecase{
		storageSvc: storageSvc,
	}
}

func (uc *GetPresignedDownloadURLUsecase) Execute(
	ctx context.Context,
	path string,
) (string, error) {
	if strings.TrimSpace(path) == "" {
		return "", errors.New("invalid object path")
	}

	return uc.storageSvc.PresignURL(ctx, storageports.PresignInput{
		Path:      path,
		Method:    "GET",
		ExpiresIn: 15 * time.Minute,
	})
}
