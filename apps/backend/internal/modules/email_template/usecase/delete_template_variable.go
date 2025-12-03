package emailtemplateusecase

import (
	"context"
	"fmt"

	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type DeleteTemplateVariableUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewDeleteTemplateVariableUsecase(
	repo emailtemplaterepository.EmailTemplateRepository,
) *DeleteTemplateVariableUsecase {
	return &DeleteTemplateVariableUsecase{repo: repo}
}

func (uc *DeleteTemplateVariableUsecase) Execute(
	ctx context.Context,
	id string,
) error {

	if err := uc.repo.DeleteVariable(id); err != nil {
		return fmt.Errorf("delete template variable: %w", err)
	}

	return nil
}
