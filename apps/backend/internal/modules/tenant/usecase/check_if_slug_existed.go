package tenantusecase

import (
	"context"

	tenantrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant/repository"
)

type CheckIfSlugExistedUsecase struct {
	tenantRepo tenantrepository.TenantRepository
}

func NewCheckIfSlugExistedUsecase(tenantRepo tenantrepository.TenantRepository) *CheckIfSlugExistedUsecase {
	return &CheckIfSlugExistedUsecase{
		tenantRepo: tenantRepo,
	}
}

func (uc *CheckIfSlugExistedUsecase) Execute(ctx context.Context, slug string) (bool, error) {
	tenant, err := uc.tenantRepo.GetBySlug(ctx, slug)
	if err != nil {
		if err == tenantrepository.ErrTenantNotFound {
			return false, nil
		}
		return false, err
	}
	return tenant != nil, nil
}
