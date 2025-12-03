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

type TemplateVariableHandler struct {
	CreateVariableUC   *emailtemplateusecase.CreateTemplateVariableUsecase
	UpdateVariableUC   *emailtemplateusecase.UpdateTemplateVariableUsecase
	DeleteVariableUC   *emailtemplateusecase.DeleteTemplateVariableUsecase
	ListTemplateVarsUC *emailtemplateusecase.ListTemplateVariablesUsecase
	Repo               emailtemplaterepository.EmailTemplateRepository
}

func (h *TemplateVariableHandler) Create(w http.ResponseWriter, r *http.Request) {
	templateID := chi.URLParam(r, "templateId")

	var body emailtemplatehandlerdto.CreateTemplateVariableRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	variable, err := h.CreateVariableUC.Execute(r.Context(), templateID, body.Key, body.Description, body.Required)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, variable, http.StatusCreated)
}

func (h *TemplateVariableHandler) List(w http.ResponseWriter, r *http.Request) {
	templateID := chi.URLParam(r, "templateId")

	variables, err := h.ListTemplateVarsUC.Execute(r.Context(), templateID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, variables, http.StatusOK)
}

func (h *TemplateVariableHandler) Update(w http.ResponseWriter, r *http.Request) {
	variableID := chi.URLParam(r, "variableId")

	var body emailtemplatehandlerdto.UpdateTemplateVariableRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	variable, err := h.Repo.FindVariableByID(variableID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if variable == nil {
		http.Error(w, "template variable not found", http.StatusNotFound)
		return
	}

	variable.Key = body.Key
	variable.Desc = body.Description
	variable.Required = body.Required

	if err := h.UpdateVariableUC.Execute(r.Context(), variable); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, variable, http.StatusOK)
}

func (h *TemplateVariableHandler) Delete(w http.ResponseWriter, r *http.Request) {
	variableID := chi.URLParam(r, "variableId")

	if err := h.DeleteVariableUC.Execute(r.Context(), variableID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
