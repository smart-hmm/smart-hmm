package emailtemplatehandlerdto

type CreateTemplateRequest struct {
	Key         string  `json:"key" validate:"required"`
	Name        string  `json:"name" validate:"required"`
	Description *string `json:"description"`
}
