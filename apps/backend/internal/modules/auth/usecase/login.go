package authusecase

import (
	"context"
	"errors"
	"fmt"

	tokenports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/token"
	refreshtokenusecase "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/usecase"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
	"golang.org/x/crypto/bcrypt"
)

type LoginUsecase struct {
	tokenService       tokenports.Service
	userRepo           userrepository.UserRepository
	createRefreshToken *refreshtokenusecase.CreateRefreshTokenUsecase
}

var (
	EmailOrPasswordError = errors.New("email or password incorrect")
	InternalServerError  = errors.New("internal server error")
)

func NewLoginUsecase(
	userRepo userrepository.UserRepository,
	tokenService tokenports.Service,
	createRefreshToken *refreshtokenusecase.CreateRefreshTokenUsecase,
) *LoginUsecase {
	return &LoginUsecase{
		userRepo:           userRepo,
		tokenService:       tokenService,
		createRefreshToken: createRefreshToken,
	}
}

func (uc *LoginUsecase) Execute(
	ctx context.Context,
	email string,
	password string,
	userAgent string,
	ipAddress string,
) (*tokenports.Tokens, error) {
	user, err := uc.userRepo.FindByEmail(email)
	if err != nil {
		return nil, EmailOrPasswordError
	}

	if err := bcrypt.CompareHashAndPassword(
		[]byte(user.PasswordHash),
		[]byte(password),
	); err != nil {
		return nil, EmailOrPasswordError
	}

	result, err := uc.tokenService.GenerateTokens(user.ID)
	if err != nil {
		return nil, InternalServerError
	}

	_, err = uc.createRefreshToken.Execute(
		ctx,
		user.ID,
		result.RefreshToken,
		userAgent,
		ipAddress,
		result.RefreshExpiresAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to persist refresh token: %w", err)
	}

	return &result, nil
}
