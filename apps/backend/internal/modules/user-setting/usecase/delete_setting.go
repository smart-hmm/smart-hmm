package usersettingsusecase

import (
	"context"

	usersettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/repository"
)

type DeleteSettingUsecase struct {
	repo usersettingrepository.UserSettingRepository
}

func NewDeleteSettingUsecase(repo usersettingrepository.UserSettingRepository) *DeleteSettingUsecase {
	return &DeleteSettingUsecase{repo: repo}
}

func (uc *DeleteSettingUsecase) Execute(ctx context.Context, userId, key string) error {
	existing, err := uc.repo.Get(userId, key)
	if err != nil {
		return err
	}
	if existing == nil {
		return nil
	}

	return uc.repo.Delete(userId, key)
}
