package emailtemplatehandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	emailtemplatehandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/email_template/dto"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
	emailtemplateusecase "github.com/smart-hmm/smart-hmm/internal/modules/email_template/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type TemplateVersionHandler struct {
	CreateVersionUC   *emailtemplateusecase.CreateTemplateVersionUsecase
	ActivateVersionUC *emailtemplateusecase.ActivateTemplateVersionUsecase
	Repo              emailtemplaterepository.EmailTemplateRepository
}

func (h *TemplateVersionHandler) Create(w http.ResponseWriter, r *http.Request) {
	templateID := chi.URLParam(r, "templateId")

	var body emailtemplatehandlerdto.CreateTemplateVersionRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	version, err := h.CreateVersionUC.Execute(
		r.Context(),
		templateID,
		body.Version,
		body.Locale,
		body.Channel,
		body.Subject,
		body.BodyHTML,
		body.BodyText,
		body.CreatedBy,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, version, http.StatusCreated)
}

func (h *TemplateVersionHandler) Activate(w http.ResponseWriter, r *http.Request) {
	versionID := chi.URLParam(r, "versionId")

	if err := h.ActivateVersionUC.Execute(r.Context(), versionID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *TemplateVersionHandler) List(w http.ResponseWriter, r *http.Request) {
	templateID := chi.URLParam(r, "templateId")

	versions, err := h.Repo.ListVersionsByTemplateID(templateID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, versions, http.StatusOK)
}
