package emailtemplatehandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	emailtemplatehandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/email_template/dto"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
	emailtemplateusecase "github.com/smart-hmm/smart-hmm/internal/modules/email_template/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type EmailTemplateHandler struct {
	CreateUC     *emailtemplateusecase.CreateEmailTemplateUsecase
	UpdateUC     *emailtemplateusecase.UpdateEmailTemplateUsecase
	SoftDeleteUC *emailtemplateusecase.SoftDeleteEmailTemplateUsecase
	Repo         emailtemplaterepository.EmailTemplateRepository
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewEmailTemplateHandler(
	createUC *emailtemplateusecase.CreateEmailTemplateUsecase,
	updateUC *emailtemplateusecase.UpdateEmailTemplateUsecase,
	softDeleteUC *emailtemplateusecase.SoftDeleteEmailTemplateUsecase,
	repo emailtemplaterepository.EmailTemplateRepository,
) *EmailTemplateHandler {
	return &EmailTemplateHandler{
		CreateUC:     createUC,
		UpdateUC:     updateUC,
		SoftDeleteUC: softDeleteUC,
		Repo:         repo,
	}
}

func (h *EmailTemplateHandler) Create(w http.ResponseWriter, r *http.Request) {
	var body emailtemplatehandlerdto.CreateEmailTemplateRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tpl, err := h.CreateUC.Execute(r.Context(), body.Name, body.Subject, body.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, tpl, http.StatusCreated)
}

func (h *EmailTemplateHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var body emailtemplatehandlerdto.UpdateEmailTemplateRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tpl, err := h.UpdateUC.Execute(r.Context(), id, body.Name, body.Subject, body.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, tpl, http.StatusOK)
}

func (h *EmailTemplateHandler) SoftDelete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	if err := h.SoftDeleteUC.Execute(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *EmailTemplateHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	template, err := h.Repo.FindByID(id)
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

func (h *EmailTemplateHandler) List(w http.ResponseWriter, r *http.Request) {
	templates, err := h.Repo.ListAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, templates, http.StatusOK)
}
