package domain

import "errors"

var (
	ErrTemplateKeyRequired  = errors.New("template key is required")
	ErrTemplateNameRequired = errors.New("template name is required")
	ErrTemplateIDRequired   = errors.New("template id is required")

	ErrInvalidTemplateVersion  = errors.New("template version must be greater than 0")
	ErrTemplateChannelRequired = errors.New("template channel is required")

	ErrTemplateVariableKeyRequired = errors.New("template variable key is required")
)
