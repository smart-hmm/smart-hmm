package systemsettingsusecase

import (
	"context"

	systemsettingdomain "github.com/smart-hmm/smart-hmm/internal/modules/system/domain"
	systemsettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/system/repository"
)

type ListSettingsUsecase struct {
	repo systemsettingrepository.SystemSettingRepository
}

func NewListSettingsUsecase(repo systemsettingrepository.SystemSettingRepository) *ListSettingsUsecase {
	return &ListSettingsUsecase{repo: repo}
}

func (uc *ListSettingsUsecase) Execute(ctx context.Context) ([]*systemsettingdomain.SystemSetting, error) {
	return uc.repo.List()
}
