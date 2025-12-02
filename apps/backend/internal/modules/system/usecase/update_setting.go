package systemsettingsusecase

import (
	"context"

	systemsettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/system/repository"
)

type UpdateSettingUsecase struct {
	repo systemsettingrepository.SystemSettingRepository
}

func NewUpdateSettingUsecase(repo systemsettingrepository.SystemSettingRepository) *UpdateSettingUsecase {
	return &UpdateSettingUsecase{repo: repo}
}

func (uc *UpdateSettingUsecase) Execute(ctx context.Context, key string, value any) error {
	return uc.repo.Set(key, value)
}
