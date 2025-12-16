package tenantmemberusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/domain"
	tenantmemberrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/repository"
)

type GetByTenantAndUserUsecase struct {
	tenantMemberRepo tenantmemberrepository.TenantMemberRepository
}

func NewGetByTenantAndUserUsecase(tenantMemberRepo tenantmemberrepository.TenantMemberRepository) *GetByTenantAndUserUsecase {
	return &GetByTenantAndUserUsecase{
		tenantMemberRepo: tenantMemberRepo,
	}
}

func (uc *GetByTenantAndUserUsecase) Execute(ctx context.Context, tenantId, userId string) (*domain.TenantMember, error) {
	tenant, err := uc.tenantMemberRepo.GetByTenantAndUser(ctx, tenantId, userId)
	if err != nil {
		if err == tenantmemberrepository.ErrTenantMemberNotFound {
			return nil, domain.ErrTenantMemberNotFound
		}
		return nil, err
	}
	return tenant, nil
}
