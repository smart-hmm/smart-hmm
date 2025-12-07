package usersettingsusecase

import (
	"context"

	usersettingdomain "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/domain"
	usersettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/repository"
)

type UpdateSettingUsecase struct {
	repo usersettingrepository.UserSettingRepository
}

func NewUpdateSettingUsecase(repo usersettingrepository.UserSettingRepository) *UpdateSettingUsecase {
	return &UpdateSettingUsecase{repo: repo}
}

func (uc *UpdateSettingUsecase) Execute(ctx context.Context, userId, key string, value any) error {
	existing, err := uc.repo.Get(userId, key)
	if err != nil {
		return err
	}

	var setting *usersettingdomain.UserSetting

	if existing == nil {
		setting, err = usersettingdomain.NewUserSetting(userId, key, value)
		if err != nil {
			return err
		}
	} else {
		existing.Update(value)
		setting = existing
	}

	return uc.repo.Save(setting)
}
