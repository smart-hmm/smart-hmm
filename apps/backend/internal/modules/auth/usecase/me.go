package authusecase

import (
	"context"
	"errors"

	"github.com/smart-hmm/smart-hmm/internal/modules/user/domain"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
)

var (
	UserNotFoundError = errors.New("user not found")
)

type MeUsecase struct {
	userRepo userrepository.UserRepository
}

func NewMeUsecase(userRepo userrepository.UserRepository) *MeUsecase {
	return &MeUsecase{
		userRepo: userRepo,
	}
}

func (uc *MeUsecase) Execute(ctx context.Context, userID string) (*domain.User, error) {
	user, err := uc.userRepo.FindByID(userID)
	if err != nil {
		return nil, UserNotFoundError
	}

	return user, nil
}
