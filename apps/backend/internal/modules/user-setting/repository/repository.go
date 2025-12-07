package systemsettingrepository

import domain "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/domain"

type UserSettingRepository interface {
	Get(userId string, key string) (*domain.UserSetting, error)
	Save(setting *domain.UserSetting) error
	Delete(userId string, key string) error
	List(userId string) ([]*domain.UserSetting, error)
}
