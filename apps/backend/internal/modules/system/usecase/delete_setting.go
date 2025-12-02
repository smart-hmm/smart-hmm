package systemsettingsusecase

import (
	"context"

	systemsettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/system/repository"
)

type DeleteSettingUsecase struct {
	repo systemsettingrepository.SystemSettingRepository
}

func NewDeleteSettingUsecase(repo systemsettingrepository.SystemSettingRepository) *DeleteSettingUsecase {
	return &DeleteSettingUsecase{repo: repo}
}

func (uc *DeleteSettingUsecase) Execute(ctx context.Context, key string) error {
	existing, err := uc.repo.Get(key)
	if err != nil {
		return err
	}
	if existing == nil {
		return nil
	}

	return uc.repo.Delete(key)
}
