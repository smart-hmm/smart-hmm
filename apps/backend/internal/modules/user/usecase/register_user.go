package userusecase

import (
	"context"
	"fmt"

	"github.com/smart-hmm/smart-hmm/internal/modules/user/domain"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
	"golang.org/x/crypto/bcrypt"
)

type RegisterUserUsecase struct {
	repo userrepository.UserRepository
}

func NewRegisterUserUsecase(repo userrepository.UserRepository) *RegisterUserUsecase {
	return &RegisterUserUsecase{repo: repo}
}

func (uc *RegisterUserUsecase) Execute(
	ctx context.Context,
	email, password string,
	role domain.UserRole,
	employeeID *string,
) error {
	hashedPwd, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	newUser, err := domain.NewUser(email, string(hashedPwd), role, employeeID)
	if err != nil {
		return err
	}

	err = uc.repo.Create(newUser)
	if err != nil {
		return err
	}

	return nil
}
