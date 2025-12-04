package authhandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	authhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/auth/dto"
	authusecase "github.com/smart-hmm/smart-hmm/internal/modules/auth/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type AuthHandler struct {
	LoginUsecase *authusecase.LoginUsecase
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewAuthHandler(loginUsecase *authusecase.LoginUsecase) *AuthHandler {
	return &AuthHandler{
		LoginUsecase: loginUsecase,
	}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var body authhandler.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		httpx.WriteJSON(w, map[string]any{"error": err.Error()}, http.StatusBadRequest)
		return
	}

	result, err := h.LoginUsecase.Execute(r.Context(), body.Email, body.Password)
	if err != nil {
		if err == authusecase.EmailOrPasswordError {
			httpx.WriteJSON(w, map[string]any{"error": err.Error()}, http.StatusUnauthorized)
			return
		}
		httpx.WriteJSON(w, map[string]any{"error": err.Error()}, http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, result, http.StatusOK)
}
