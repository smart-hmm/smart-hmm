package emailtemplatehandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	emailtemplatehandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/email_template/dto"
	"github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
	emailtemplateusecase "github.com/smart-hmm/smart-hmm/internal/modules/email_template/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type TemplateHandler struct {
	CreateTemplateUC  *emailtemplateusecase.CreateTemplateUsecase
	PreviewTemplateUC *emailtemplateusecase.PreviewTemplateUsecase
	Repo              emailtemplaterepository.EmailTemplateRepository
}

func (h *TemplateHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body emailtemplatehandlerdto.CreateTemplateRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tpl, err := h.CreateTemplateUC.Execute(r.Context(), body.Key, body.Name, body.Description)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, tpl, http.StatusCreated)
}

func (h *TemplateHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "templateId")

	template, err := h.Repo.FindTemplateByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if template == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, template, http.StatusOK)
}

func (h *TemplateHandler) List(w http.ResponseWriter, r *http.Request) {
	templates, err := h.Repo.ListTemplates()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, templates, http.StatusOK)
}

func (h *TemplateHandler) Preview(w http.ResponseWriter, r *http.Request) {
	var body emailtemplatehandlerdto.PreviewTemplateRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	renderData := domain.RenderData(body.Data)

	subject, bodyHTML, bodyText, err := h.PreviewTemplateUC.Execute(
		r.Context(),
		body.Key,
		body.Locale,
		body.Channel,
		renderData,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, map[string]string{
		"subject":   subject,
		"body_html": bodyHTML,
		"body_text": bodyText,
	}, http.StatusOK)
}

func (h *TemplateHandler) SoftDelete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "templateId")

	if err := h.Repo.SoftDeleteTemplate(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
