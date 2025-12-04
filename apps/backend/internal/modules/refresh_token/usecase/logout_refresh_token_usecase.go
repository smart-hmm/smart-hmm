package refreshtokenusecase

import (
	"context"
	"fmt"

	"github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/domain"
	refreshtokenrepository "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/repository"
)

type LogoutRefreshTokenUsecase struct {
	repo refreshtokenrepository.RefreshTokenRepository
}

func NewLogoutRefreshTokenUsecase(
	repo refreshtokenrepository.RefreshTokenRepository,
) *LogoutRefreshTokenUsecase {
	return &LogoutRefreshTokenUsecase{repo: repo}
}

func (uc *LogoutRefreshTokenUsecase) Execute(
	ctx context.Context,
	rawToken string,
) error {

	tokenHash := domain.HashRefreshToken(rawToken)

	if err := uc.repo.DeleteByTokenHash(tokenHash); err != nil {
		return fmt.Errorf("failed to delete refresh token: %w", err)
	}

	return nil
}
