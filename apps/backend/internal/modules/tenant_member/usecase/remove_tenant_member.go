package tenantmemberusecase

import (
	"context"

	tenantMemberDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/domain"
	tenantmemberrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/repository"
)

type RemoveTenantMemberInput struct {
	TenantID     string
	TargetUserID string
	ActorUserID  string
}

type RemoveTenantMemberUseCase struct {
	repo tenantmemberrepository.TenantMemberRepository
}

func NewRemoveTenantMemberUseCase(
	repo tenantmemberrepository.TenantMemberRepository,
) *RemoveTenantMemberUseCase {
	return &RemoveTenantMemberUseCase{repo: repo}
}

func (uc *RemoveTenantMemberUseCase) Execute(
	ctx context.Context,
	in RemoveTenantMemberInput,
) error {

	actor, err := uc.repo.GetByTenantAndUser(ctx, in.TenantID, in.ActorUserID)
	if err != nil {
		return err
	}

	if actor.Role != tenantMemberDomain.TenantOwnerRole {
		return tenantMemberDomain.ErrPermissionDenied
	}

	target, err := uc.repo.GetByTenantAndUser(ctx, in.TenantID, in.TargetUserID)
	if err != nil {
		return err
	}

	if target.Role == tenantMemberDomain.TenantOwnerRole {
		count, err := uc.repo.CountByTenantAndRole(
			ctx,
			in.TenantID,
			tenantMemberDomain.TenantOwnerRole,
		)
		if err != nil {
			return err
		}

		if count <= 1 {
			return tenantMemberDomain.ErrLastOwnerRemovalDenied
		}
	}

	return uc.repo.Delete(ctx, in.TenantID, in.TargetUserID)
}
