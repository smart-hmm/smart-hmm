package tenantusecase

import (
	"context"

	tenantDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantRepo "github.com/smart-hmm/smart-hmm/internal/modules/tenant/repository"

	tenantMemberDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/domain"
	tenantMemberRepo "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/repository"

	txpkg "github.com/smart-hmm/smart-hmm/internal/pkg/tx"
)

type CreateTenantWithOwnerInput struct {
	Name        string
	Slug        string
	OwnerUserID string
}

type CreateTenantWithOwnerUseCase struct {
	tenantRepo       tenantRepo.TenantRepository
	tenantMemberRepo tenantMemberRepo.TenantMemberRepository
	txManager        txpkg.Manager
}

func NewCreateTenantWithOwnerUseCase(
	tenantRepo tenantRepo.TenantRepository,
	tenantMemberRepo tenantMemberRepo.TenantMemberRepository,
	txManager txpkg.Manager,
) *CreateTenantWithOwnerUseCase {
	return &CreateTenantWithOwnerUseCase{
		tenantRepo:       tenantRepo,
		tenantMemberRepo: tenantMemberRepo,
		txManager:        txManager,
	}
}

func (uc *CreateTenantWithOwnerUseCase) Execute(
	ctx context.Context,
	in CreateTenantWithOwnerInput,
) (*tenantDomain.Tenant, error) {

	var tenant *tenantDomain.Tenant

	err := uc.txManager.WithTx(ctx, func(txCtx context.Context) error {
		var err error

		tenant, err = tenantDomain.NewTenant(
			in.Name,
			in.Slug,
			in.OwnerUserID,
		)
		if err != nil {
			return err
		}

		if err := uc.tenantRepo.Save(txCtx, tenant); err != nil {
			return err
		}

		member, err := tenantMemberDomain.NewTenantMember(
			tenant.ID,
			in.OwnerUserID,
			tenantMemberDomain.TenantOwnerRole,
		)
		if err != nil {
			return err
		}

		if err := uc.tenantMemberRepo.Save(txCtx, member); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return tenant, nil
}
