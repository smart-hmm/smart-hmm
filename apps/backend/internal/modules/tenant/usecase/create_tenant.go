package tenantusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant/repository"
)

type CreateTenantUsecase struct {
	tenantRepo tenantrepository.TenantRepository
}

func NewCreateTenantUsecase(tenantRepo tenantrepository.TenantRepository) *CreateTenantUsecase {
	return &CreateTenantUsecase{
		tenantRepo: tenantRepo,
	}
}

func (uc *CreateTenantUsecase) Execute(ctx context.Context, name, slug, userId string) (*domain.Tenant, error) {
	newTenant, err := domain.NewTenant(name, slug, userId)
	if err != nil {
		return nil, err
	}

	err = uc.tenantRepo.Save(ctx, newTenant)
	if err != nil {
		return nil, err
	}

	return newTenant, nil
}
