package emailtemplatehandlerdto

import "github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"

type PreviewTemplateRequest struct {
	Key     string                 `json:"key" validate:"required"`
	Locale  string                 `json:"locale" validate:"required"`
	Channel domain.TemplateChannel `json:"channel" validate:"required"`
	Data    map[string]any         `json:"data"`
}
