package tenantrepository

import (
	"context"
	"errors"

	"github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
)

var (
	ErrTenantNotFound             = errors.New("tenant not found")
	ErrWorkspaceSlugAlreadyExists = errors.New("worksplace slug already existed")
)

type TenantRepository interface {
	GetByID(ctx context.Context, id string) (*domain.Tenant, error)
	GetBySlug(ctx context.Context, slug string) (*domain.Tenant, error)
	Save(ctx context.Context, tenant *domain.Tenant) error
	Delete(ctx context.Context, tenant *domain.Tenant) error
}
