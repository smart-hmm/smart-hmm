package emailtemplaterepository

import "github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"

type EmailTemplateRepository interface {
	Create(t *domain.EmailTemplate) error
	Update(t *domain.EmailTemplate) error

	FindByID(id string) (*domain.EmailTemplate, error)
	FindByName(name string) (*domain.EmailTemplate, error)
	ListAll() ([]*domain.EmailTemplate, error)

	SoftDelete(id string) error
}
