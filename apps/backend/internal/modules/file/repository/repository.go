package filerepository

import (
	"context"
	"time"

	domain "github.com/smart-hmm/smart-hmm/internal/modules/file/domain"
)

type FileRepository interface {
	Create(ctx context.Context, file *domain.File) error
	GetByID(ctx context.Context, id string) (*domain.File, error)
	GetByPath(ctx context.Context, path string) (*domain.File, error)
	ListByDepartment(ctx context.Context, departmentID string) ([]*domain.File, error)
	SoftDelete(ctx context.Context, id string, deletedAt time.Time) error
}
