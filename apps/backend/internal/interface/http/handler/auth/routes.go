package authhandler

import "github.com/go-chi/chi/v5"

func (h *AuthHandler) Routes(r chi.Router) {
	r.Post("/login", h.Login)
}
