package systemsettingshandler

import "github.com/go-chi/chi/v5"

func (h *SystemSettingsHandler) Routes(r chi.Router) {
	r.Get("/", h.List)
	r.Get("/{key}", h.Get)
	r.Put("/{key}", h.Update)
	r.Delete("/{key}", h.Delete)
}
