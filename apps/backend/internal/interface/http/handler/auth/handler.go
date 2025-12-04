package authhandler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	authhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/auth/dto"
	authusecase "github.com/smart-hmm/smart-hmm/internal/modules/auth/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/authctx"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type AuthHandler struct {
	LoginUsecase        *authusecase.LoginUsecase
	MeUsecase           *authusecase.MeUsecase
	RefreshTokenUsecase *authusecase.RefreshTokenUsecase
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewAuthHandler(loginUsecase *authusecase.LoginUsecase, meUsecase *authusecase.MeUsecase, refreshTokenUsecase *authusecase.RefreshTokenUsecase) *AuthHandler {
	return &AuthHandler{
		LoginUsecase:        loginUsecase,
		MeUsecase:           meUsecase,
		RefreshTokenUsecase: refreshTokenUsecase,
	}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var body authhandler.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		httpx.WriteJSON(w, map[string]any{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	userAgent := r.UserAgent()
	ipAddress := httpx.GetClientIP(r)
	result, err := h.LoginUsecase.Execute(r.Context(), body.Email, body.Password, userAgent, ipAddress)
	if err != nil {
		if err == authusecase.EmailOrPasswordError {
			httpx.WriteJSON(w, map[string]any{"error": err.Error()}, http.StatusUnauthorized)
			return
		}
		httpx.WriteJSON(w, map[string]any{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    result.RefreshToken,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Expires:  result.RefreshExpiresAt,
	})

	httpx.WriteJSON(w, map[string]any{
		"accessToken":     result.AccessToken,
		"accessExpiresAt": result.AccessExpiresAt,
	}, http.StatusOK)
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := authctx.UserID(r.Context())
	if !ok {
		httpx.WriteJSON(w, nil, http.StatusUnauthorized)
		return
	}

	user, err := h.MeUsecase.Execute(r.Context(), userID)
	if err != nil {
		if err == authusecase.UserNotFoundError {
			httpx.WriteJSON(w, map[string]any{"error": authusecase.UserNotFoundError.Error()}, http.StatusNotFound)
			return
		}
	}

	httpx.WriteJSON(w, user, http.StatusOK)
}

func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	refreshToken, err := r.Cookie("refresh_token")
	if err != nil {
		expired := time.Unix(0, 0)

		http.SetCookie(w, &http.Cookie{
			Name:     "access_token",
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			Expires:  expired,
			SameSite: http.SameSiteNoneMode,
			MaxAge:   -1,
		})

		http.SetCookie(w, &http.Cookie{
			Name:     "refresh_token",
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			Expires:  expired,
			SameSite: http.SameSiteNoneMode,
			MaxAge:   -1,
		})

		httpx.WriteJSON(w, map[string]any{
			"error": "missing refresh token",
		}, http.StatusUnauthorized)
		return
	}

	userAgent := r.UserAgent()
	ipAddress := httpx.GetClientIP(r)
	result, err := h.RefreshTokenUsecase.Execute(r.Context(), refreshToken.Value, userAgent, ipAddress)
	if err != nil {
		expired := time.Unix(0, 0)

		http.SetCookie(w, &http.Cookie{
			Name:     "access_token",
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			Expires:  expired,
			SameSite: http.SameSiteNoneMode,
			MaxAge:   -1,
		})

		http.SetCookie(w, &http.Cookie{
			Name:     "refresh_token",
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			Expires:  expired,
			SameSite: http.SameSiteNoneMode,
			MaxAge:   -1,
		})

		httpx.WriteJSON(w, map[string]any{
			"error": "failed to refresh token",
		}, http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    result.RefreshToken,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
		Expires:  result.RefreshExpiresAt,
	})

	httpx.WriteJSON(w, map[string]any{
		"accessToken":     result.AccessToken,
		"accessExpiresAt": result.AccessExpiresAt,
	}, http.StatusOK)
}
