package tenantmemberusecase

import (
	"context"

	tenantDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantmemberrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/repository"
)

type GetTenantsByUserIdUsecase struct {
	repo tenantmemberrepository.TenantMemberRepository
}

func NewGetTenantsByUserIdUsecase(
	repo tenantmemberrepository.TenantMemberRepository,
) *GetTenantsByUserIdUsecase {
	return &GetTenantsByUserIdUsecase{repo: repo}
}

func (uc *GetTenantsByUserIdUsecase) Execute(ctx context.Context, userId string) ([]*tenantDomain.Tenant, error) {
	tenants, err := uc.repo.GetTenantsByUserId(ctx, userId)
	if err != nil {
		return make([]*tenantDomain.Tenant, 0), nil
	}
	return tenants, nil
}
