package emailtemplateusecase

import (
	"context"
	"fmt"

	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type SoftDeleteEmailTemplateUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewSoftDeleteEmailTemplateUsecase(repo emailtemplaterepository.EmailTemplateRepository) *SoftDeleteEmailTemplateUsecase {
	return &SoftDeleteEmailTemplateUsecase{repo: repo}
}

func (uc *SoftDeleteEmailTemplateUsecase) Execute(ctx context.Context, id string) error {
	if err := uc.repo.SoftDelete(id); err != nil {
		return fmt.Errorf("soft delete email template: %w", err)
	}

	return nil
}
