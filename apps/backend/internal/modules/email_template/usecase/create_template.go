package emailtemplateusecase

import (
	"context"
	"fmt"

	"github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type CreateTemplateUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewCreateTemplateUsecase(
	repo emailtemplaterepository.EmailTemplateRepository,
) *CreateTemplateUsecase {
	return &CreateTemplateUsecase{repo: repo}
}

func (uc *CreateTemplateUsecase) Execute(
	ctx context.Context,
	key string,
	name string,
	description *string,
) (*domain.Template, error) {

	template, err := domain.NewTemplate(key, name, description)
	if err != nil {
		return nil, err
	}

	if err := uc.repo.CreateTemplate(template); err != nil {
		return nil, fmt.Errorf("create template: %w", err)
	}

	return template, nil
}
