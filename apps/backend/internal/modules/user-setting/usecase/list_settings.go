package usersettingsusecase

import (
	"context"

	usersettingdomain "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/domain"
	usersettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/repository"
)

type ListSettingsUsecase struct {
	repo usersettingrepository.UserSettingRepository
}

func NewListSettingsUsecase(repo usersettingrepository.UserSettingRepository) *ListSettingsUsecase {
	return &ListSettingsUsecase{repo: repo}
}

func (uc *ListSettingsUsecase) Execute(ctx context.Context, userId string) ([]*usersettingdomain.UserSetting, error) {
	return uc.repo.List(userId)
}
