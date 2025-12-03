package emailtemplateusecase

import (
	"context"
	"fmt"

	"github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type ListTemplateVariablesUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewListTemplateVariablesUsecase(
	repo emailtemplaterepository.EmailTemplateRepository,
) *ListTemplateVariablesUsecase {
	return &ListTemplateVariablesUsecase{repo: repo}
}

func (uc *ListTemplateVariablesUsecase) Execute(
	ctx context.Context,
	templateID string,
) ([]*domain.TemplateVariable, error) {

	variables, err := uc.repo.FindVariablesByTemplateID(templateID)
	if err != nil {
		return nil, fmt.Errorf("list template variables: %w", err)
	}

	return variables, nil
}
