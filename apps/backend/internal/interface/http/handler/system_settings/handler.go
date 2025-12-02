package systemsettingshandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	systemsettingsusecase "github.com/smart-hmm/smart-hmm/internal/modules/system/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type SystemSettingsHandler struct {
	GetUC    *systemsettingsusecase.GetSettingUsecase
	ListUC   *systemsettingsusecase.ListSettingsUsecase
	UpdateUC *systemsettingsusecase.UpdateSettingUsecase
	DeleteUC *systemsettingsusecase.DeleteSettingUsecase
}

func NewSystemSettingsHandler(
	getUC *systemsettingsusecase.GetSettingUsecase,
	listUC *systemsettingsusecase.ListSettingsUsecase,
	updateUC *systemsettingsusecase.UpdateSettingUsecase,
	deleteUC *systemsettingsusecase.DeleteSettingUsecase,
) *SystemSettingsHandler {
	return &SystemSettingsHandler{
		GetUC:    getUC,
		ListUC:   listUC,
		UpdateUC: updateUC,
		DeleteUC: deleteUC,
	}
}

func (h *SystemSettingsHandler) Get(w http.ResponseWriter, r *http.Request) {
	key := chi.URLParam(r, "key")

	s, err := h.GetUC.Execute(r.Context(), key)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if s == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, s)
}

func (h *SystemSettingsHandler) List(w http.ResponseWriter, r *http.Request) {
	settings, err := h.ListUC.Execute(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, settings)
}

func (h *SystemSettingsHandler) Update(w http.ResponseWriter, r *http.Request) {
	key := chi.URLParam(r, "key")

	var body struct {
		Value any `json:"value"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	err := h.UpdateUC.Execute(r.Context(), key, body.Value)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *SystemSettingsHandler) Delete(w http.ResponseWriter, r *http.Request) {
	key := chi.URLParam(r, "key")

	err := h.DeleteUC.Execute(r.Context(), key)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
