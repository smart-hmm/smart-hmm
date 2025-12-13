package tenantprofilerepository

import (
	"context"
	"errors"

	"github.com/smart-hmm/smart-hmm/internal/modules/tenant_profile/domain"
)

var (
	ErrTenantProfileNotFound      = errors.New("tenant profile not found")
	ErrTenantProfileAlreadyExists = errors.New("tenant profile already exists")
)

type TenantProfileRepository interface {
	Create(ctx context.Context, profile *domain.TenantProfile) error
	GetByTenantID(ctx context.Context, tenantID string) (*domain.TenantProfile, error)
	Update(ctx context.Context, profile *domain.TenantProfile) error
	ExistsByTenantID(ctx context.Context, tenantID string) (bool, error)
}
