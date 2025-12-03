package emailtemplateusecase

import (
	"context"
	"fmt"

	"github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type UpdateTemplateVariableUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewUpdateTemplateVariableUsecase(
	repo emailtemplaterepository.EmailTemplateRepository,
) *UpdateTemplateVariableUsecase {
	return &UpdateTemplateVariableUsecase{repo: repo}
}

func (uc *UpdateTemplateVariableUsecase) Execute(
	ctx context.Context,
	variable *domain.TemplateVariable,
) error {

	if err := uc.repo.UpdateVariable(variable); err != nil {
		return fmt.Errorf("update template variable: %w", err)
	}

	return nil
}
