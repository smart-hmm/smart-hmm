package tenantusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant/repository"
)

type GetTenantByIdUsecase struct {
	tenantRepo tenantrepository.TenantRepository
}

func NewGetTenantByIdUsecase(tenantRepo tenantrepository.TenantRepository) *GetTenantByIdUsecase {
	return &GetTenantByIdUsecase{
		tenantRepo: tenantRepo,
	}
}

func (uc *GetTenantByIdUsecase) Execute(ctx context.Context, id string) (*domain.Tenant, error) {
	tenant, err := uc.tenantRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return tenant, nil
}
