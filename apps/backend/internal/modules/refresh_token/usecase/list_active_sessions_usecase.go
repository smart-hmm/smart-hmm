package refreshtokenusecase

import (
	"context"
	"fmt"

	"github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/domain"
	refreshtokenrepository "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/repository"
)

type ListActiveSessionsUsecase struct {
	repo refreshtokenrepository.RefreshTokenRepository
}

func NewListActiveSessionsUsecase(
	repo refreshtokenrepository.RefreshTokenRepository,
) *ListActiveSessionsUsecase {
	return &ListActiveSessionsUsecase{repo: repo}
}

func (uc *ListActiveSessionsUsecase) Execute(
	ctx context.Context,
	userID string,
) ([]*domain.RefreshToken, error) {

	sessions, err := uc.repo.ListActiveByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to list active sessions: %w", err)
	}

	return sessions, nil
}
