package emailtemplaterepository

import "github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"

type EmailTemplateRepository interface {
	CreateTemplate(t *domain.Template) error
	UpdateTemplate(t *domain.Template) error
	FindTemplateByID(id string) (*domain.Template, error)
	FindTemplateByKey(key string) (*domain.Template, error)
	ListTemplates() ([]*domain.Template, error)
	SoftDeleteTemplate(id string) error

	CreateVersion(v *domain.TemplateVersion) error
	UpdateVersion(v *domain.TemplateVersion) error
	FindVersionByID(id string) (*domain.TemplateVersion, error)
	FindActiveVersion(templateKey, locale string, channel domain.TemplateChannel) (*domain.TemplateVersion, error)
	ListVersionsByTemplateID(templateID string) ([]*domain.TemplateVersion, error)
	SetActiveVersion(versionID string) error
	ArchiveVersion(versionID string) error
	SoftDeleteVersion(id string) error

	CreateVariable(v *domain.TemplateVariable) error
	UpdateVariable(v *domain.TemplateVariable) error
	FindVariableByID(id string) (*domain.TemplateVariable, error)
	FindVariablesByTemplateID(templateID string) ([]*domain.TemplateVariable, error)
	DeleteVariable(id string) error
}
