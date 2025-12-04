package authusecase

import (
	"context"
	"errors"

	tokenports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/token"
	refreshtokendomain "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/domain"
	refreshtokenrepository "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/repository"
	refreshtokenusecase "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/usecase"
)

var (
	InvalidRefreshTokenError = errors.New("invalid refresh token")
)

type RefreshTokenUsecase struct {
	tokenService     tokenports.Service
	refreshTokenRepo refreshtokenrepository.RefreshTokenRepository
	rotateRefreshUC  *refreshtokenusecase.RotateRefreshTokenUsecase
}

func NewRefreshTokenUsecase(
	refreshTokenRepo refreshtokenrepository.RefreshTokenRepository,
	tokenService tokenports.Service,
	rotateRefreshUC *refreshtokenusecase.RotateRefreshTokenUsecase,
) *RefreshTokenUsecase {
	return &RefreshTokenUsecase{
		refreshTokenRepo: refreshTokenRepo,
		tokenService:     tokenService,
		rotateRefreshUC:  rotateRefreshUC,
	}
}

func (uc *RefreshTokenUsecase) Execute(
	ctx context.Context,
	rawRefreshToken string,
	userAgent string,
	ipAddress string,
) (*tokenports.Tokens, error) {
	sub, err := uc.tokenService.ValidateRefreshToken(rawRefreshToken)
	if err != nil {
		return nil, InvalidRefreshTokenError
	}

	newTokens, err := uc.tokenService.GenerateTokens(sub)
	if err != nil {
		return nil, InvalidRefreshTokenError
	}

	_, err = uc.rotateRefreshUC.Execute(
		ctx,
		sub,
		rawRefreshToken,
		newTokens.RefreshToken,
		userAgent,
		ipAddress,
		newTokens.RefreshExpiresAt,
	)
	if err != nil {
		if errors.Is(err, refreshtokendomain.ErrRefreshTokenReplayed) ||
			errors.Is(err, refreshtokendomain.ErrRefreshTokenExpired) ||
			errors.Is(err, refreshtokendomain.ErrRefreshTokenRevoked) {
			return nil, InvalidRefreshTokenError
		}
		return nil, err
	}

	return &newTokens, nil
}
