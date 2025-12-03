package emailtemplateusecase

import (
	"context"
	"fmt"

	"github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type CreateEmailTemplateUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewCreateEmailTemplateUsecase(repo emailtemplaterepository.EmailTemplateRepository) *CreateEmailTemplateUsecase {
	return &CreateEmailTemplateUsecase{repo: repo}
}

func (uc *CreateEmailTemplateUsecase) Execute(ctx context.Context, name, subject, body string) (*domain.EmailTemplate, error) {
	template, err := domain.NewEmailTemplate(name, subject, body)
	if err != nil {
		return nil, err
	}

	if err := uc.repo.Create(template); err != nil {
		return nil, fmt.Errorf("create email template: %w", err)
	}

	return template, nil
}
