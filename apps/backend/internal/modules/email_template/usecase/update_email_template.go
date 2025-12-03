package emailtemplateusecase

import (
	"context"
	"fmt"

	"github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type UpdateEmailTemplateUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewUpdateEmailTemplateUsecase(repo emailtemplaterepository.EmailTemplateRepository) *UpdateEmailTemplateUsecase {
	return &UpdateEmailTemplateUsecase{repo: repo}
}

func (uc *UpdateEmailTemplateUsecase) Execute(ctx context.Context, id, name, subject, body string) (*domain.EmailTemplate, error) {
	template, err := uc.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("find email template: %w", err)
	}
	if template == nil {
		return nil, fmt.Errorf("email template not found")
	}

	if err := template.Update(name, subject, body); err != nil {
		return nil, err
	}

	if err := uc.repo.Update(template); err != nil {
		return nil, fmt.Errorf("update email template: %w", err)
	}

	return template, nil
}
