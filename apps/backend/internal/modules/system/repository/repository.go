package systemsettingrepository

import domain "github.com/smart-hmm/smart-hmm/internal/modules/system/domain"

type SystemSettingRepository interface {
	Set(key string, value any) error
	Get(key string) (*domain.SystemSetting, error)
	Delete(key string) error
	List() ([]*domain.SystemSetting, error)
}
