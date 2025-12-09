package filehandler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"

	filedto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/file/dto"
	filerepo "github.com/smart-hmm/smart-hmm/internal/modules/file/repository"
	fileusecase "github.com/smart-hmm/smart-hmm/internal/modules/file/usecase"
	"github.com/smart-hmm/smart-hmm/internal/pkg/authctx"
	"github.com/smart-hmm/smart-hmm/internal/pkg/httpx"
)

type FileHandler struct {
	GetUC        *fileusecase.GetFileUsecase
	ListUC       *fileusecase.ListFilesByDepartmentUsecase
	CreateUC     *fileusecase.ConfirmUploadUsecase
	SoftDeleteUC *fileusecase.SoftDeleteFileUsecase

	Repo filerepo.FileRepository
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func NewFileHandler(
	getUC *fileusecase.GetFileUsecase,
	listUC *fileusecase.ListFilesByDepartmentUsecase,
	createUC *fileusecase.ConfirmUploadUsecase,
	softDeleteUC *fileusecase.SoftDeleteFileUsecase,
	repo filerepo.FileRepository,
) *FileHandler {
	return &FileHandler{
		GetUC:        getUC,
		ListUC:       listUC,
		CreateUC:     createUC,
		SoftDeleteUC: softDeleteUC,

		Repo: repo,
	}
}

func (h *FileHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	file, downloadURL, err := h.GetUC.Execute(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if file == nil {
		http.Error(w, "file not found", http.StatusNotFound)
		return
	}

	httpx.WriteJSON(w, map[string]any{
		"file":        file,
		"downloadURL": downloadURL,
	}, http.StatusOK)
}

func (h *FileHandler) List(w http.ResponseWriter, r *http.Request) {
	departmentID := r.URL.Query().Get("departmentId")
	if departmentID == "" {
		http.Error(w, "departmentId is required", http.StatusBadRequest)
		return
	}

	result, err := h.ListUC.Execute(r.Context(), departmentID)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	json.NewEncoder(w).Encode(result)
}

func (h *FileHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req filedto.CreateFileRequest

	userId, ok := authctx.UserID(r.Context())
	if !ok {
		http.Error(w, "", http.StatusUnauthorized)
		return
	}

	json.NewDecoder(r.Body).Decode(&req)

	if err := validate.Struct(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := h.CreateUC.Execute(r.Context(), fileusecase.ConfirmUploadInput{
		DepartmentID: req.DepartmentID,
		StoragePath:  req.StoragePath,
		Filename:     req.Filename,
		ContentType:  req.ContentType,
		Size:         req.Size,
		UploadedBy:   userId,
	})
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	json.NewEncoder(w).Encode(result)
}

func (h *FileHandler) SoftDelete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	err := h.SoftDeleteUC.Execute(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
