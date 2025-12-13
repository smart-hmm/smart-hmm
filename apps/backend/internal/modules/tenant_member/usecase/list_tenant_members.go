package tenantmemberusecase

import (
	"context"

	tenantMemberDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/domain"
	tenantmemberrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/repository"
)

type ListTenantMembersInput struct {
	TenantID    string
	ActorUserID string
}

type ListTenantMembersUseCase struct {
	repo tenantmemberrepository.TenantMemberRepository
}

func NewListTenantMembersUseCase(
	repo tenantmemberrepository.TenantMemberRepository,
) *ListTenantMembersUseCase {
	return &ListTenantMembersUseCase{repo: repo}
}

func (uc *ListTenantMembersUseCase) Execute(
	ctx context.Context,
	in ListTenantMembersInput,
) ([]*tenantMemberDomain.TenantMember, error) {

	_, err := uc.repo.GetByTenantAndUser(ctx, in.TenantID, in.ActorUserID)
	if err != nil {
		return nil, tenantMemberDomain.ErrPermissionDenied
	}

	return uc.repo.ListByTenantID(ctx, in.TenantID)
}
