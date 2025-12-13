package tenantprofileusecase

import (
	"context"
	"errors"

	tenantprofiledomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant_profile/domain"
	tenantprofilerepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant_profile/repository"
)

var (
	ErrTenantProfileAlreadyExists = errors.New("tenant profile already exists")
)

type CreateNewTenantProfileUsecase struct {
	tenantProfileRepo tenantprofilerepository.TenantProfileRepository
}

func NewCreateNewTenantProfileUsecase(
	tenantProfileRepo tenantprofilerepository.TenantProfileRepository,
) *CreateNewTenantProfileUsecase {
	return &CreateNewTenantProfileUsecase{
		tenantProfileRepo: tenantProfileRepo,
	}
}

func (uc *CreateNewTenantProfileUsecase) Execute(
	ctx context.Context,
	in tenantprofiledomain.NewTenantProfileInput,
) (*tenantprofiledomain.TenantProfile, error) {
	exists, err := uc.tenantProfileRepo.ExistsByTenantID(ctx, in.TenantID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, ErrTenantProfileAlreadyExists
	}

	profile, err := tenantprofiledomain.NewTenantProfile(in)
	if err != nil {
		return nil, err
	}

	if err := uc.tenantProfileRepo.Create(ctx, profile); err != nil {
		return nil, err
	}

	return profile, nil
}
