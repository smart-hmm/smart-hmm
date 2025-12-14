package tenanthandler

import (
	"github.com/go-chi/chi/v5"
)

func (h *TenantHandler) Routes(r chi.Router) {
	r.Post("/onboarding", h.Onboarding)
	r.Get("/{slug}", h.GetBySlug)
	r.Post("/", h.Create)
	r.Get("/", h.GetByID)
	r.Put("/", h.Update)
	r.Delete("/", h.Delete)
}
