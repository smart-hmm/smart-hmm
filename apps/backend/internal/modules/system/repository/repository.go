package systemsettingrepository

import domain "github.com/smart-hmm/smart-hmm/internal/modules/system/domain"

type SystemSettingRepository interface {
	Get(key string) (*domain.SystemSetting, error)
	Save(setting *domain.SystemSetting) error
	Delete(key string) error
	List() ([]*domain.SystemSetting, error)
}
