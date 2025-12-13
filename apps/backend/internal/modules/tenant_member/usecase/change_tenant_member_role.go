package tenantmemberusecase

import (
	"context"

	tenantMemberDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/domain"
	tenantmemberrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/repository"
)

type ChangeTenantMemberRoleInput struct {
	TenantID     string
	TargetUserID string
	ActorUserID  string
	NewRole      tenantMemberDomain.TenantRole
}

type ChangeTenantMemberRoleUseCase struct {
	repo tenantmemberrepository.TenantMemberRepository
}

func NewChangeTenantMemberRoleUseCase(
	repo tenantmemberrepository.TenantMemberRepository,
) *ChangeTenantMemberRoleUseCase {
	return &ChangeTenantMemberRoleUseCase{repo: repo}
}

func (uc *ChangeTenantMemberRoleUseCase) Execute(
	ctx context.Context,
	in ChangeTenantMemberRoleInput,
) error {
	actor, err := uc.repo.GetByTenantAndUser(ctx, in.TenantID, in.ActorUserID)
	if err != nil {
		return err
	}

	if actor.Role != tenantMemberDomain.TenantOwnerRole {
		return tenantMemberDomain.ErrPermissionDenied
	}

	if in.ActorUserID == in.TargetUserID {
		return tenantMemberDomain.ErrSelfRoleChangeDenied
	}

	target, err := uc.repo.GetByTenantAndUser(ctx, in.TenantID, in.TargetUserID)
	if err != nil {
		return err
	}

	if err := target.UpdateMemberRole(in.NewRole); err != nil {
		return err
	}

	return uc.repo.Save(ctx, target)
}
