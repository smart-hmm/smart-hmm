package jwtservice

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	tokenports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/token"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrTokenExpired = errors.New("token expired")
)

type claims struct {
	Sub string `json:"sub"`
	Exp int64  `json:"exp"`
}

type Service struct {
	accessSecret  []byte
	refreshSecret []byte
	accessTTL     time.Duration
	refreshTTL    time.Duration
}

func New(accessSecret, refreshSecret string, accessTTL, refreshTTL time.Duration) *Service {
	return &Service{
		accessSecret:  []byte(accessSecret),
		refreshSecret: []byte(refreshSecret),
		accessTTL:     accessTTL,
		refreshTTL:    refreshTTL,
	}
}

func (s *Service) GenerateTokens(userID string) (tokenports.Tokens, error) {
	accessToken, accessExp, err := s.createToken(userID, s.accessSecret, s.accessTTL)
	if err != nil {
		return tokenports.Tokens{}, fmt.Errorf("generate access token: %w", err)
	}

	refreshToken, refreshExp, err := s.createToken(userID, s.refreshSecret, s.refreshTTL)
	if err != nil {
		return tokenports.Tokens{}, fmt.Errorf("generate refresh token: %w", err)
	}

	return tokenports.Tokens{
		AccessToken:      accessToken,
		AccessExpiresAt:  accessExp,
		RefreshToken:     refreshToken,
		RefreshExpiresAt: refreshExp,
	}, nil
}

func (s *Service) ValidateAccessToken(token string) (string, error) {
	return s.validateToken(token, s.accessSecret)
}

func (s *Service) ValidateRefreshToken(token string) (string, error) {
	return s.validateToken(token, s.refreshSecret)
}

func (s *Service) createToken(userID string, secret []byte, ttl time.Duration) (string, time.Time, error) {
	header := base64.RawURLEncoding.EncodeToString([]byte(`{"alg":"HS256","typ":"JWT"}`))

	exp := time.Now().UTC().Add(ttl)
	payloadBytes, err := json.Marshal(claims{
		Sub: userID,
		Exp: exp.Unix(),
	})
	if err != nil {
		return "", time.Time{}, fmt.Errorf("marshal claims: %w", err)
	}

	payload := base64.RawURLEncoding.EncodeToString(payloadBytes)
	signingInput := header + "." + payload

	sig := sign(signingInput, secret)

	return signingInput + "." + sig, exp, nil
}

func (s *Service) validateToken(token string, secret []byte) (string, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return "", ErrInvalidToken
	}

	signingInput := parts[0] + "." + parts[1]
	expectedSig := sign(signingInput, secret)

	if !hmac.Equal([]byte(expectedSig), []byte(parts[2])) {
		return "", ErrInvalidToken
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return "", ErrInvalidToken
	}

	var c claims
	if err := json.Unmarshal(payloadBytes, &c); err != nil {
		return "", ErrInvalidToken
	}

	if c.Sub == "" {
		return "", ErrInvalidToken
	}

	if time.Unix(c.Exp, 0).Before(time.Now().UTC()) {
		return "", ErrTokenExpired
	}

	return c.Sub, nil
}

func sign(data string, secret []byte) string {
	mac := hmac.New(sha256.New, secret)
	_, _ = mac.Write([]byte(data))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}
