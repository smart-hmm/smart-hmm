package emailtemplateusecase

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type CreateTemplateVersionUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewCreateTemplateVersionUsecase(
	repo emailtemplaterepository.EmailTemplateRepository,
) *CreateTemplateVersionUsecase {
	return &CreateTemplateVersionUsecase{repo: repo}
}

func (uc *CreateTemplateVersionUsecase) Execute(
	ctx context.Context,
	templateID string,
	version int,
	locale string,
	channel domain.TemplateChannel,
	subject *string,
	bodyHTML *string,
	bodyText *string,
	createdBy *string,
) (*domain.TemplateVersion, error) {

	tid, err := uuid.Parse(templateID)
	if err != nil {
		return nil, fmt.Errorf("invalid template id: %w", err)
	}

	var uid *uuid.UUID
	if createdBy != nil {
		u, err := uuid.Parse(*createdBy)
		if err != nil {
			return nil, fmt.Errorf("invalid created_by id: %w", err)
		}
		uid = &u
	}

	versionEntity, err := domain.NewTemplateVersion(
		tid,
		version,
		locale,
		channel,
		subject,
		bodyHTML,
		bodyText,
		uid,
	)
	if err != nil {
		return nil, err
	}

	if err := uc.repo.CreateVersion(versionEntity); err != nil {
		return nil, fmt.Errorf("create template version: %w", err)
	}

	return versionEntity, nil
}
