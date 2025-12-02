package userusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/user/domain"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
)

type RegisterUserUsecase struct {
	repo userrepository.UserRepository
}

func NewRegisterUserUsecase(repo userrepository.UserRepository) *RegisterUserUsecase {
	return &RegisterUserUsecase{repo: repo}
}

func (uc *RegisterUserUsecase) Execute(ctx context.Context, email, hashedPwd string, role domain.UserRole, employeeID *string) (*domain.User, error) {
	newUser, err := domain.NewUser(email, hashedPwd, role, employeeID)
	if err != nil {
		return nil, err
	}
	return newUser, uc.repo.Create(newUser)
}
