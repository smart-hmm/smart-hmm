package systemsettingsusecase

import (
	"context"

	systemsettingdomain "github.com/smart-hmm/smart-hmm/internal/modules/system/domain"
	systemsettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/system/repository"
)

type UpdateSettingUsecase struct {
	repo systemsettingrepository.SystemSettingRepository
}

func NewUpdateSettingUsecase(repo systemsettingrepository.SystemSettingRepository) *UpdateSettingUsecase {
	return &UpdateSettingUsecase{repo: repo}
}

func (uc *UpdateSettingUsecase) Execute(ctx context.Context, key string, value any) error {
	existing, err := uc.repo.Get(key)
	if err != nil {
		return err
	}

	var setting *systemsettingdomain.SystemSetting

	if existing == nil {
		setting, err = systemsettingdomain.NewSystemSetting(key, value)
		if err != nil {
			return err
		}
	} else {
		existing.Update(value)
		setting = existing
	}

	return uc.repo.Save(setting)
}
