package refreshtokenusecase

import (
	"context"
	"fmt"

	refreshtokenrepository "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/repository"
)

type ForceLogoutAllUsecase struct {
	repo refreshtokenrepository.RefreshTokenRepository
}

func NewForceLogoutAllUsecase(
	repo refreshtokenrepository.RefreshTokenRepository,
) *ForceLogoutAllUsecase {
	return &ForceLogoutAllUsecase{repo: repo}
}

func (uc *ForceLogoutAllUsecase) Execute(
	ctx context.Context,
	userID string,
) error {

	if err := uc.repo.DeleteByUserID(userID); err != nil {
		return fmt.Errorf("failed to force logout all sessions: %w", err)
	}

	return nil
}
