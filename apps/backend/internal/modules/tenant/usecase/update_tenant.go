package tenantusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant/repository"
)

type UpdateTenantUsecase struct {
	tenantRepo tenantrepository.TenantRepository
}

func NewUpdateTenantUsecase(tenantRepo tenantrepository.TenantRepository) *UpdateTenantUsecase {
	return &UpdateTenantUsecase{
		tenantRepo: tenantRepo,
	}
}

func (uc *UpdateTenantUsecase) Execute(ctx context.Context, tenantID string, name string, slug string) (*domain.Tenant, error) {
	tenant, err := uc.tenantRepo.GetByID(ctx, tenantID)
	if err != nil {
		return nil, err
	}

	if tenant.IsDeleted() {
		return nil, domain.ErrTenantAlreadyDeleted
	}

	tenant.Update(name, slug)

	if err := uc.tenantRepo.Save(ctx, tenant); err != nil {
		return nil, err
	}

	return tenant, nil
}
