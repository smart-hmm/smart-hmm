package domain

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"time"
)

var (
	ErrRefreshTokenExpired  = errors.New("refresh token has expired")
	ErrRefreshTokenRevoked  = errors.New("refresh token has been revoked")
	ErrInvalidRefreshToken  = errors.New("invalid refresh token")
	ErrRefreshTokenReplayed = errors.New("refresh token reuse detected")
)

type RefreshToken struct {
	ID        string
	UserID    string
	TokenHash string

	UserAgent string
	IPAddress string

	ExpiresAt time.Time
	RevokedAt *time.Time
	CreatedAt time.Time
}

func NewRefreshTokenWithExpiry(
	userID string,
	rawToken string,
	userAgent string,
	ipAddress string,
	expiresAt time.Time,
) (*RefreshToken, error) {

	if rawToken == "" {
		return nil, ErrInvalidRefreshToken
	}

	now := time.Now().UTC()

	return &RefreshToken{
		UserID:    userID,
		TokenHash: HashRefreshToken(rawToken),
		UserAgent: userAgent,
		IPAddress: ipAddress,
		ExpiresAt: expiresAt,
		CreatedAt: now,
	}, nil
}

func (t *RefreshToken) Validate() error {
	now := time.Now().UTC()

	if t.RevokedAt != nil {
		return ErrRefreshTokenRevoked
	}

	if now.After(t.ExpiresAt) {
		return ErrRefreshTokenExpired
	}

	return nil
}

func (t *RefreshToken) Revoke() {
	now := time.Now().UTC()
	t.RevokedAt = &now
}

func HashRefreshToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}

func IsReplayAttack(err error) bool {
	return errors.Is(err, ErrRefreshTokenReplayed)
}
