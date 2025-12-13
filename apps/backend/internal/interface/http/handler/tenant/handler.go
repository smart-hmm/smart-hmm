package tenanthandler

import (
	"encoding/json"
	"net/http"

	tenantusecase "github.com/smart-hmm/smart-hmm/internal/modules/tenant/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/authctx"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type TenantHandler struct {
	CreateUC        *tenantusecase.CreateTenantUsecase
	UpdateUC        *tenantusecase.UpdateTenantUsecase
	DeleteUC        *tenantusecase.DeleteTenantUsecase
	GetTenantByIdUC *tenantusecase.GetTenantByIdUsecase
}

func NewTenantHandler(
	createUC *tenantusecase.CreateTenantUsecase,
	updateUC *tenantusecase.UpdateTenantUsecase,
	deleteUC *tenantusecase.DeleteTenantUsecase,
	getTenantByIdUC *tenantusecase.GetTenantByIdUsecase,
) *TenantHandler {
	return &TenantHandler{
		CreateUC:        createUC,
		UpdateUC:        updateUC,
		DeleteUC:        deleteUC,
		GetTenantByIdUC: getTenantByIdUC,
	}
}

func (h *TenantHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	_, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	tenantID := r.URL.Query().Get("id")
	if tenantID == "" {
		http.Error(w, "tenant id is required", http.StatusBadRequest)
		return
	}

	tenant, err := h.GetTenantByIdUC.Execute(r.Context(), tenantID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, tenant, http.StatusOK)
}

func (h *TenantHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var body struct {
		Name string `json:"name"`
		Slug string `json:"slug"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if body.Name == "" || body.Slug == "" {
		http.Error(w, "name and slug are required", http.StatusBadRequest)
		return
	}

	tenant, err := h.CreateUC.Execute(
		r.Context(),
		body.Name,
		body.Slug,
		userID,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, tenant, http.StatusCreated)
}

func (h *TenantHandler) Update(w http.ResponseWriter, r *http.Request) {
	_, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	tenantID := r.URL.Query().Get("id")
	if tenantID == "" {
		http.Error(w, "tenant id is required", http.StatusBadRequest)
		return
	}

	var body struct {
		Name string `json:"name"`
		Slug string `json:"slug"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	tenant, err := h.UpdateUC.Execute(
		r.Context(),
		tenantID,
		body.Name,
		body.Slug,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, tenant, http.StatusOK)
}

func (h *TenantHandler) Delete(w http.ResponseWriter, r *http.Request) {
	_, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	tenantID := r.URL.Query().Get("id")
	if tenantID == "" {
		http.Error(w, "tenant id is required", http.StatusBadRequest)
		return
	}

	tenant, err := h.DeleteUC.Execute(r.Context(), tenantID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	httpx.WriteJSON(w, tenant, http.StatusOK)
}
