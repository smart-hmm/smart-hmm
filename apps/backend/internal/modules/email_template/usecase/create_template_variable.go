package emailtemplateusecase

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type CreateTemplateVariableUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewCreateTemplateVariableUsecase(
	repo emailtemplaterepository.EmailTemplateRepository,
) *CreateTemplateVariableUsecase {
	return &CreateTemplateVariableUsecase{repo: repo}
}

func (uc *CreateTemplateVariableUsecase) Execute(
	ctx context.Context,
	templateID string,
	key string,
	description *string,
	required bool,
) (*domain.TemplateVariable, error) {

	tid, err := uuid.Parse(templateID)
	if err != nil {
		return nil, fmt.Errorf("invalid template id: %w", err)
	}

	variable, err := domain.NewTemplateVariable(
		tid,
		key,
		description,
		required,
	)
	if err != nil {
		return nil, err
	}

	if err := uc.repo.CreateVariable(variable); err != nil {
		return nil, fmt.Errorf("create template variable: %w", err)
	}

	return variable, nil
}
