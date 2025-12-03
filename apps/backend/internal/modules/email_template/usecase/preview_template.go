package emailtemplateusecase

import (
	"bytes"
	"context"
	"fmt"
	"html/template"

	"github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type PreviewTemplateUsecase struct {
	repo emailtemplaterepository.EmailTemplateRepository
}

func NewPreviewTemplateUsecase(
	repo emailtemplaterepository.EmailTemplateRepository,
) *PreviewTemplateUsecase {
	return &PreviewTemplateUsecase{repo: repo}
}

func (uc *PreviewTemplateUsecase) Execute(
	ctx context.Context,
	templateKey string,
	locale string,
	channel domain.TemplateChannel,
	data domain.RenderData,
) (subject string, bodyHTML string, bodyText string, err error) {

	tpl, err := uc.repo.FindActiveVersion(templateKey, locale, channel)
	if err != nil {
		return "", "", "", fmt.Errorf("find active template: %w", err)
	}

	if tpl.Subject != nil {
		subTpl, err := template.New("subject").Parse(*tpl.Subject)
		if err != nil {
			return "", "", "", fmt.Errorf("parse subject: %w", err)
		}
		var b bytes.Buffer
		if err := subTpl.Execute(&b, data); err != nil {
			return "", "", "", fmt.Errorf("render subject: %w", err)
		}
		subject = b.String()
	}

	if tpl.BodyHTML != nil {
		htmlTpl, err := template.New("body_html").Parse(*tpl.BodyHTML)
		if err != nil {
			return "", "", "", fmt.Errorf("parse html body: %w", err)
		}
		var b bytes.Buffer
		if err := htmlTpl.Execute(&b, data); err != nil {
			return "", "", "", fmt.Errorf("render html body: %w", err)
		}
		bodyHTML = b.String()
	}

	if tpl.BodyText != nil {
		textTpl, err := template.New("body_text").Parse(*tpl.BodyText)
		if err != nil {
			return "", "", "", fmt.Errorf("parse text body: %w", err)
		}
		var b bytes.Buffer
		if err := textTpl.Execute(&b, data); err != nil {
			return "", "", "", fmt.Errorf("render text body: %w", err)
		}
		bodyText = b.String()
	}

	return subject, bodyHTML, bodyText, nil
}
