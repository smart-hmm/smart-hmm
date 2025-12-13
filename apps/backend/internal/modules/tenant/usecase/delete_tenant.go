package tenantusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant/repository"
)

type DeleteTenantUsecase struct {
	tenantRepo tenantrepository.TenantRepository
}

func NewDeleteTenantUsecase(tenantRepo tenantrepository.TenantRepository) *DeleteTenantUsecase {
	return &DeleteTenantUsecase{
		tenantRepo: tenantRepo,
	}
}

func (uc *DeleteTenantUsecase) Execute(ctx context.Context, id string) (*domain.Tenant, error) {
	tenant, err := uc.tenantRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if err := tenant.Delete(); err != nil {
		return nil, err
	}

	if err := uc.tenantRepo.Delete(ctx, tenant); err != nil {
		return nil, err
	}

	return tenant, nil
}
