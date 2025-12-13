package tenantmemberusecase

import (
	"context"
	"strings"

	tenantMemberDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/domain"
	tenantmemberrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/repository"
)

type CreateTenantMemberInput struct {
	TenantID string
	UserID   string
	Role     tenantMemberDomain.TenantRole
}

type CreateTenantMemberUsecase struct {
	tenantMemberRepo tenantmemberrepository.TenantMemberRepository
}

func NewCreateTenantMemberUsecase(tenantMemberRepo tenantmemberrepository.TenantMemberRepository) *CreateTenantMemberUsecase {
	return &CreateTenantMemberUsecase{
		tenantMemberRepo: tenantMemberRepo,
	}
}

func (uc *CreateTenantMemberUsecase) Execute(ctx context.Context, in CreateTenantMemberInput) (*tenantMemberDomain.TenantMember, error) {
	tenantId := strings.TrimSpace(in.TenantID)
	userId := strings.TrimSpace(in.UserID)
	role := in.Role

	exists, err := uc.tenantMemberRepo.Exists(ctx, tenantId, userId)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, tenantMemberDomain.ErrTenantMemberAlreadyExists
	}

	tenantMember, err := tenantMemberDomain.NewTenantMember(tenantId, userId, role)
	if err != nil {
		return nil, err
	}

	err = uc.tenantMemberRepo.Save(ctx, tenantMember)
	if err != nil {
		return nil, err
	}

	return tenantMember, nil
}
