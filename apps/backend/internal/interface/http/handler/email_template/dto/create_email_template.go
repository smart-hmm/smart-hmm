package emailtemplatehandlerdto

type CreateEmailTemplateRequest struct {
	Name    string `json:"name" validate:"required"`
	Subject string `json:"subject" validate:"required"`
	Body    string `json:"body" validate:"required"`
}
