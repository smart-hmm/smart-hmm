package emailtemplateusecase

import (
	"context"
	"fmt"

	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type ActivateTemplateVersionUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewActivateTemplateVersionUsecase(
	repo emailtemplaterepository.EmailTemplateRepository,
) *ActivateTemplateVersionUsecase {
	return &ActivateTemplateVersionUsecase{repo: repo}
}

func (uc *ActivateTemplateVersionUsecase) Execute(
	ctx context.Context,
	versionID string,
) error {

	if err := uc.repo.SetActiveVersion(versionID); err != nil {
		return fmt.Errorf("activate template version: %w", err)
	}

	return nil
}
