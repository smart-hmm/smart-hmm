package refreshtokenusecase

import (
	"context"
	"fmt"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/domain"
	refreshtokenrepository "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/repository"
)

type CreateRefreshTokenUsecase struct {
	repo refreshtokenrepository.RefreshTokenRepository
}

func NewCreateRefreshTokenUsecase(
	repo refreshtokenrepository.RefreshTokenRepository,
) *CreateRefreshTokenUsecase {
	return &CreateRefreshTokenUsecase{repo: repo}
}

func (uc *CreateRefreshTokenUsecase) Execute(
	ctx context.Context,
	userID string,
	rawToken string,
	userAgent string,
	ipAddress string,
	expiresAt time.Time,
) (*domain.RefreshToken, error) {

	newToken, err := domain.NewRefreshTokenWithExpiry(
		userID,
		rawToken,
		userAgent,
		ipAddress,
		expiresAt,
	)
	if err != nil {
		return nil, err
	}

	if err := uc.repo.Create(newToken); err != nil {
		return nil, fmt.Errorf("failed to persist refresh token: %w", err)
	}

	return newToken, nil
}
