package storageusecase

import (
	"context"
	"errors"
	"strings"
	"time"

	storageports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/storage"
)

type GenPresignedURLUsecase struct {
	storageSvc storageports.StorageService
}

func NewGenPresignedURLUsecase(storageSvc storageports.StorageService) *GenPresignedURLUsecase {
	return &GenPresignedURLUsecase{
		storageSvc: storageSvc,
	}
}

func (uc *GenPresignedURLUsecase) Execute(
	ctx context.Context,
	path string,
	method string,
	contentType string,
	expiresIn time.Duration,
) (string, error) {
	if strings.TrimSpace(path) == "" {
		return "", errors.New("invalid object path")
	}

	if expiresIn == 0 {
		expiresIn = 5 * time.Minute
	}

	if method == "" {
		method = "PUT"
	}

	return uc.storageSvc.PresignURL(ctx, storageports.PresignInput{
		Path:        path,
		ExpiresIn:   expiresIn,
		Method:      method,
		ContentType: contentType,
	})
}
