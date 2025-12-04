package refreshtokenrepository

import "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/domain"

type RefreshTokenRepository interface {
	Create(token *domain.RefreshToken) error
	DeleteByID(id string) error
	DeleteByTokenHash(tokenHash string) error
	DeleteByUserID(userID string) error
	RevokeByTokenHash(tokenHash string) error
	FindByTokenHash(tokenHash string) (*domain.RefreshToken, error)
	ListActiveByUserID(userID string) ([]*domain.RefreshToken, error)
	DeleteExpired() error
}
