package tenanthandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	tenantusecase "github.com/smart-hmm/smart-hmm/internal/modules/tenant/usecase"
	"github.com/smart-hmm/smart-hmm/internal/modules/tenant_profile/domain"
	tenantprofileusecase "github.com/smart-hmm/smart-hmm/internal/modules/tenant_profile/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/authctx"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type TenantHandler struct {
	CreateUC                 *tenantusecase.CreateTenantUsecase
	UpdateUC                 *tenantusecase.UpdateTenantUsecase
	DeleteUC                 *tenantusecase.DeleteTenantUsecase
	GetTenantByIdUC          *tenantusecase.GetTenantByIdUsecase
	GetTenantBySlugUC        *tenantusecase.GetTenantBySlugUsecase
	CreateWithOwnerUC        *tenantusecase.CreateTenantWithOwnerUseCase
	CheckIfSlugExistedUC     *tenantusecase.CheckIfSlugExistedUsecase
	CreateNewTenantProfileUC *tenantprofileusecase.CreateNewTenantProfileUsecase
}

func NewTenantHandler(
	createUC *tenantusecase.CreateTenantUsecase,
	updateUC *tenantusecase.UpdateTenantUsecase,
	deleteUC *tenantusecase.DeleteTenantUsecase,
	getTenantByIdUC *tenantusecase.GetTenantByIdUsecase,
	createWithOwnerUC *tenantusecase.CreateTenantWithOwnerUseCase,
	createNewTenantProfileUC *tenantprofileusecase.CreateNewTenantProfileUsecase,
	getTenantBySlugUC *tenantusecase.GetTenantBySlugUsecase,
	checkIfSlugExistedUC *tenantusecase.CheckIfSlugExistedUsecase,
) *TenantHandler {
	return &TenantHandler{
		CreateUC:                 createUC,
		UpdateUC:                 updateUC,
		DeleteUC:                 deleteUC,
		GetTenantByIdUC:          getTenantByIdUC,
		CreateWithOwnerUC:        createWithOwnerUC,
		CreateNewTenantProfileUC: createNewTenantProfileUC,
		GetTenantBySlugUC:        getTenantBySlugUC,
		CheckIfSlugExistedUC:     checkIfSlugExistedUC,
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

func (h *TenantHandler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	userId, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	slug := chi.URLParam(r, "slug")
	if slug == "" {
		http.Error(w, "tenant slug is required", http.StatusBadRequest)
		return
	}

	tenant, err := h.GetTenantBySlugUC.Execute(r.Context(), slug, userId)
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

func (h *TenantHandler) Onboarding(w http.ResponseWriter, r *http.Request) {
	userID, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var body struct {
		Name        string             `json:"name"`
		Slug        string             `json:"slug"`
		Industry    string             `json:"industry"`
		CompanySize domain.CompanySize `json:"companySize"`
		Country     string             `json:"country"`
		Timezone    string             `json:"timezone"`
		Currency    string             `json:"currency"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if body.Name == "" || body.Slug == "" {
		http.Error(w, "name and slug are required", http.StatusBadRequest)
		return
	}

	in := tenantusecase.CreateTenantWithOwnerInput{
		Name:        body.Name,
		Slug:        body.Slug,
		OwnerUserID: userID,
	}

	tenant, err := h.CreateWithOwnerUC.Execute(r.Context(), in)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	createNewTenantProfileInput := domain.NewTenantProfileInput{
		TenantID:    tenant.ID,
		LegalName:   &body.Name,
		Industry:    body.Industry,
		CompanySize: body.CompanySize,
		Country:     &body.Country,
		Timezone:    &body.Timezone,
		Currency:    &body.Currency,
	}

	tenantProfile, _ := h.CreateNewTenantProfileUC.Execute(r.Context(), createNewTenantProfileInput)

	httpx.WriteJSON(w, map[string]any{
		"tenant":         tenant,
		"tenant_profile": tenantProfile,
	}, http.StatusCreated)
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

func (h *TenantHandler) CheckIfSlugAvailable(w http.ResponseWriter, r *http.Request) {
	slug := r.URL.Query().Get("slug")
	if slug == "" {
		httpx.WriteJSON(w, "missing slug query param", http.StatusBadRequest)
		return
	}

	existed, err := h.CheckIfSlugExistedUC.Execute(r.Context(), slug)
	if err != nil {
		httpx.WriteJSON(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if existed {
		httpx.WriteJSON(w, map[string]any{
			"error": "slug was already taken",
		}, http.StatusConflict)
		return
	}

	httpx.WriteJSON(w, true, http.StatusOK)
}
