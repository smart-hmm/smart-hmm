package emailtemplatehandler

import "github.com/go-chi/chi/v5"

func (h *EmailTemplateHandler) Routes(r chi.Router) {
	r.Get("/", h.Template.List)
	r.Post("/", h.Template.Create)
	r.Post("/preview", h.Template.Preview)
	r.Post("/versions/{versionId}/activate", h.Version.Activate)
	r.Put("/variables/{variableId}", h.Variable.Update)
	r.Delete("/variables/{variableId}", h.Variable.Delete)

	r.Route("/{templateId}", func(r chi.Router) {
		r.Get("/", h.Template.Get)
		r.Delete("/", h.Template.SoftDelete)

		r.Route("/versions", func(r chi.Router) {
			r.Get("/", h.Version.List)
			r.Post("/", h.Version.Create)
		})

		r.Route("/variables", func(r chi.Router) {
			r.Get("/", h.Variable.List)
			r.Post("/", h.Variable.Create)
		})
	})
}
