package emailtemplatehandlerdto

import "github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"

type CreateTemplateVersionRequest struct {
	Version   int                    `json:"version" validate:"required,gt=0"`
	Locale    string                 `json:"locale" validate:"required"`
	Channel   domain.TemplateChannel `json:"channel" validate:"required"`
	Subject   *string                `json:"subject"`
	BodyHTML  *string                `json:"body_html"`
	BodyText  *string                `json:"body_text"`
	CreatedBy *string                `json:"created_by"`
}
