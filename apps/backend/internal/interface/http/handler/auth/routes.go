package authhandler

import (
	"github.com/go-chi/chi/v5"
	tokenports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/token"
	"github.com/smart-hmm/smart-hmm/internal/interface/http/middleware"
)

func (h *AuthHandler) Routes(r chi.Router, tokenService tokenports.Service) {
	r.Post("/login", h.Login)
	r.Get("/refresh", h.RefreshToken)
	r.With(middleware.JWTGuard(tokenService)).Get("/me", h.Me)
}
