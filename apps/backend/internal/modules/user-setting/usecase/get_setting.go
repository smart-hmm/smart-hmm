package usersettingsusecase

import (
	"context"

	usersettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/repository"
)

type GetSettingUsecase struct {
	repo usersettingrepository.UserSettingRepository
}

func NewGetSettingUsecase(repo usersettingrepository.UserSettingRepository) *GetSettingUsecase {
	return &GetSettingUsecase{repo: repo}
}

func (uc *GetSettingUsecase) Execute(ctx context.Context, userId, key string) (any, error) {
	return uc.repo.Get(userId, key)
}
