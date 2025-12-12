package aihandler

import "github.com/go-chi/chi/v5"

func (h *AIHandler) Routes(r chi.Router) {
	r.Post("/ask", h.Ask)
}
