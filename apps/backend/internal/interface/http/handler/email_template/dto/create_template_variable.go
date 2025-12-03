package emailtemplatehandlerdto

type CreateTemplateVariableRequest struct {
	Key         string  `json:"key" validate:"required"`
	Description *string `json:"description"`
	Required    bool    `json:"required"`
}
