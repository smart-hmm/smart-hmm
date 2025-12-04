package authusecase

import (
	"context"
	"errors"

	tokenports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/token"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
	"golang.org/x/crypto/bcrypt"
)

type LoginUsecase struct {
	tokenService tokenports.Service
	userRepo     userrepository.UserRepository
}

var (
	EmailOrPasswordError = errors.New("email or password incorrect")
	InternalServerError  = errors.New("internal server error")
)

func NewLoginUsecase(userRepo userrepository.UserRepository, tokenService tokenports.Service) *LoginUsecase {
	return &LoginUsecase{
		userRepo:     userRepo,
		tokenService: tokenService,
	}
}

func (uc *LoginUsecase) Execute(ctx context.Context, email, password string) (*tokenports.Tokens, error) {
	user, err := uc.userRepo.FindByEmail(email)
	if err != nil {
		return nil, EmailOrPasswordError
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return nil, EmailOrPasswordError
	}

	result, err := uc.tokenService.GenerateTokens(user.ID)
	if err != nil {
		return nil, InternalServerError
	}

	return &result, nil
}
