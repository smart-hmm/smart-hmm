package usersettingshandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	usersettingsusecase "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/authctx"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type UserSettingsHandler struct {
	GetUC    *usersettingsusecase.GetSettingUsecase
	ListUC   *usersettingsusecase.ListSettingsUsecase
	UpdateUC *usersettingsusecase.UpdateSettingUsecase
	DeleteUC *usersettingsusecase.DeleteSettingUsecase
}

func NewUserSettingsHandler(
	getUC *usersettingsusecase.GetSettingUsecase,
	listUC *usersettingsusecase.ListSettingsUsecase,
	updateUC *usersettingsusecase.UpdateSettingUsecase,
	deleteUC *usersettingsusecase.DeleteSettingUsecase,
) *UserSettingsHandler {
	return &UserSettingsHandler{
		GetUC:    getUC,
		ListUC:   listUC,
		UpdateUC: updateUC,
		DeleteUC: deleteUC,
	}
}

func (h *UserSettingsHandler) Get(w http.ResponseWriter, r *http.Request) {
	userId, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	key := chi.URLParam(r, "key")

	s, err := h.GetUC.Execute(r.Context(), userId, key)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if s == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, s, http.StatusOK)
}

func (h *UserSettingsHandler) List(w http.ResponseWriter, r *http.Request) {
	userId, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	settings, err := h.ListUC.Execute(r.Context(), userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, settings, http.StatusOK)
}

func (h *UserSettingsHandler) Update(w http.ResponseWriter, r *http.Request) {
	userId, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	key := chi.URLParam(r, "key")

	var body struct {
		Value any `json:"value"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	err := h.UpdateUC.Execute(r.Context(), userId, key, body.Value)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *UserSettingsHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userId, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	key := chi.URLParam(r, "key")

	err := h.DeleteUC.Execute(r.Context(), userId, key)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
