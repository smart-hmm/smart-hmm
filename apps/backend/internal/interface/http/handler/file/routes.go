package filehandler

import "github.com/go-chi/chi/v5"

func (h *FileHandler) Routes(r chi.Router) {
	r.Get("/", h.List)              // GET /files?departmentId=
	r.Post("/", h.Create)           // POST /files (confirm upload)
	r.Get("/{id}", h.Get)           // GET /files/{id}
	r.Delete("/{id}", h.SoftDelete) // DELETE /files/{id} (soft delete)
}
