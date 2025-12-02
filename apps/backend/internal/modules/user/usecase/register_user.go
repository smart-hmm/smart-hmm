package userusecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/smart-hmm/smart-hmm/internal/modules/user/domain"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
)

type RegisterUserUsecase struct {
	repo userrepository.UserRepository
}

func NewRegisterUserUsecase(repo userrepository.UserRepository) *RegisterUserUsecase {
	return &RegisterUserUsecase{repo: repo}
}

func (uc *RegisterUserUsecase) Execute(ctx context.Context, email, hashedPwd, role string, employeeID *string) (*domain.User, error) {
	u := &domain.User{
		ID:           uuid.NewString(),
		Email:        email,
		PasswordHash: hashedPwd,
		Role:         domain.UserRole(role),
		EmployeeID:   employeeID,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	return u, uc.repo.Create(u)
}
