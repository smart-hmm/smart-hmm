package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/file/domain"
	filerepository "github.com/smart-hmm/smart-hmm/internal/modules/file/repository"
)

type FilePostgresRepository struct {
	db *pgxpool.Pool
}

func NewFilePostgresRepository(db *pgxpool.Pool) filerepository.FileRepository {
	return &FilePostgresRepository{db: db}
}

func (r *FilePostgresRepository) Create(ctx context.Context, file *domain.File) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO files
		 (department_id, storage_path, filename, content_type, size, created_at, uploaded_by)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		*file.DepartmentID,
		file.StoragePath,
		file.Filename,
		file.ContentType,
		file.Size,
		file.CreatedAt,
		*file.UploadedBy,
	)
	return err
}

func (r *FilePostgresRepository) GetByID(ctx context.Context, id string) (*domain.File, error) {
	return scanFile(
		r.db.QueryRow(context.Background(),
			`SELECT id, department_id, storage_path, filename, content_type,
			        size, created_at, uploaded_by, deleted_at
			   FROM files
			   WHERE id = $1
			     AND deleted_at IS NULL`,
			id,
		),
	)
}

func (r *FilePostgresRepository) GetByPath(ctx context.Context, path string) (*domain.File, error) {
	return scanFile(
		r.db.QueryRow(context.Background(),
			`SELECT id, department_id, storage_path, filename, content_type,
			        size, created_at, uploaded_by, deleted_at
			   FROM files
			   WHERE storage_path = $1
			     AND deleted_at IS NULL`,
			path,
		),
	)
}

func (r *FilePostgresRepository) ListByDepartment(ctx context.Context, departmentID string) ([]*domain.File, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, department_id, storage_path, filename, content_type,
		        size, created_at, uploaded_by, deleted_at
		   FROM files
		   WHERE department_id = $1
		     AND deleted_at IS NULL
		   ORDER BY created_at DESC`,
		departmentID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.File

	for rows.Next() {
		item, err := scanFile(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}

func (r *FilePostgresRepository) SoftDelete(ctx context.Context, id string, deletedAt time.Time) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE files
		 SET deleted_at = $1
		 WHERE id = $2`,
		deletedAt,
		id,
	)
	return err
}

func scanFile(row pgx.Row) (*domain.File, error) {
	var f domain.File

	var contentType *string
	var deletedAt *time.Time
	var uploadedBy *string

	err := row.Scan(
		&f.ID,
		&f.DepartmentID,
		&f.StoragePath,
		&f.Filename,
		&contentType,
		&f.Size,
		&f.CreatedAt,
		&uploadedBy,
		&deletedAt,
	)
	if err != nil {
		return nil, err
	}

	if contentType != nil {
		f.ContentType = *contentType
	}

	f.UploadedBy = uploadedBy
	f.DeletedAt = deletedAt

	return &f, nil
}
