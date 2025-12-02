package systemsettingsusecase

import (
	"context"

	systemsettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/system/repository"
)

type GetSettingUsecase struct {
	repo systemsettingrepository.SystemSettingRepository
}

func NewGetSettingUsecase(repo systemsettingrepository.SystemSettingRepository) *GetSettingUsecase {
	return &GetSettingUsecase{repo: repo}
}

func (uc *GetSettingUsecase) Execute(ctx context.Context, key string) (any, error) {
	return uc.repo.Get(key)
}
