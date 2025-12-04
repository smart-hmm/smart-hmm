package refreshtokenusecase

import (
	"context"
	"fmt"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/domain"
	refreshtokenrepository "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/repository"
)

type RotateRefreshTokenUsecase struct {
	repo refreshtokenrepository.RefreshTokenRepository
}

func NewRotateRefreshTokenUsecase(
	repo refreshtokenrepository.RefreshTokenRepository,
) *RotateRefreshTokenUsecase {
	return &RotateRefreshTokenUsecase{repo: repo}
}

func (uc *RotateRefreshTokenUsecase) Execute(
	ctx context.Context,
	userID string,
	rawOldToken string,
	rawNewToken string,
	userAgent string,
	ipAddress string,
	expiresAt time.Time,
) (*domain.RefreshToken, error) {
	oldHash := domain.HashRefreshToken(rawOldToken)

	storedToken, err := uc.repo.FindByTokenHash(oldHash)
	if err != nil {
		_ = uc.repo.DeleteByUserID(userID)
		return nil, domain.ErrRefreshTokenReplayed
	}

	if err := storedToken.Validate(); err != nil {
		return nil, err
	}

	storedToken.Revoke()
	if err := uc.repo.RevokeByTokenHash(oldHash); err != nil {
		return nil, fmt.Errorf("failed to revoke refresh token: %w", err)
	}

	newToken, err := domain.NewRefreshTokenWithExpiry(
		userID,
		rawNewToken,
		userAgent,
		ipAddress,
		expiresAt,
	)
	if err != nil {
		return nil, err
	}

	// 6️⃣ Persist rotated token
	if err := uc.repo.Create(newToken); err != nil {
		return nil, fmt.Errorf("failed to persist rotated refresh token: %w", err)
	}

	return newToken, nil
}
