package tenantusecase

import (
	"context"
	"slices"

	"github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant/repository"
	tenantmemberusecase "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/usecase"
)

type GetTenantBySlugUsecase struct {
	tenantRepo           tenantrepository.TenantRepository
	getTenantsByUserIdUC *tenantmemberusecase.GetTenantsByUserIdUsecase
}

func NewGetTenantBySlugUsecase(tenantRepo tenantrepository.TenantRepository, getTenantsByUserIdUC *tenantmemberusecase.GetTenantsByUserIdUsecase) *GetTenantBySlugUsecase {
	return &GetTenantBySlugUsecase{
		tenantRepo:           tenantRepo,
		getTenantsByUserIdUC: getTenantsByUserIdUC,
	}
}

func (uc *GetTenantBySlugUsecase) Execute(ctx context.Context, slug, actor string) (*domain.Tenant, error) {
	tenant, err := uc.tenantRepo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	userTenants, err := uc.getTenantsByUserIdUC.Execute(ctx, actor)
	if err != nil || len(userTenants) == 0 {
		return nil, domain.ErrUnauthorized
	}

	if !slices.ContainsFunc(userTenants, func(t *domain.Tenant) bool {
		return t.ID == tenant.ID
	}) {
		return nil, domain.ErrUnauthorized
	}

	return tenant, err
}
