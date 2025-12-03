package userhandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	userhandlerdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/user/dto"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
	userusecase "github.com/smart-hmm/smart-hmm/internal/modules/user/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type UserHandler struct {
	RegisterUC *userusecase.RegisterUserUsecase
	Repo       userrepository.UserRepository
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewUserHandler(registerUC *userusecase.RegisterUserUsecase, repo userrepository.UserRepository) *UserHandler {
	return &UserHandler{
		RegisterUC: registerUC,
		Repo:       repo,
	}
}

// CreateUser godoc
// @Summary Register
// @Description Register an user's account
// @Tags Users
// @Accept json
// @Produce json
// @Param body body userhandlerdto.RegisterUserRequest true "User Data"
// @Router /users [post]
func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	var body userhandlerdto.RegisterUserRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := validate.Struct(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := h.RegisterUC.Execute(r.Context(), body.Email, body.Password, body.Role, body.EmployeeID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *UserHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	user, err := h.Repo.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if user == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, user, http.StatusOK)
}

func (h *UserHandler) List(w http.ResponseWriter, r *http.Request) {
	users, err := h.Repo.ListAll()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	httpx.WriteJSON(w, users, http.StatusOK)
}
