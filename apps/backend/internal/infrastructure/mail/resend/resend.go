package resendmail

import (
	"context"

	"github.com/resend/resend-go/v3"
	mailports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/mail"
)

type ResendMailService struct {
	client *resend.Client
}

var _ mailports.MailService = (*ResendMailService)(nil)

func NewResendMailService(apiKey string) *ResendMailService {
	client := resend.NewClient(apiKey)
	return &ResendMailService{client}
}

func (r *ResendMailService) SendPlain(
	ctx context.Context,
	to []string,
	subject string,
	text string,
) error {
	params := &resend.SendEmailRequest{
		From:    "Acme <onboarding@resend.dev>",
		To:      to,
		Html:    text,
		Subject: subject,
	}

	_, err := r.client.Emails.Send(params)
	if err != nil {
		return err
	}
	return nil
}

func (r *ResendMailService) SendHTML(
	ctx context.Context,
	to []string,
	subject string,
	html string,
) error {
	params := &resend.SendEmailRequest{
		From:    "Acme <onboarding@resend.dev>",
		To:      to,
		Html:    html,
		Subject: subject,
	}

	_, err := r.client.Emails.Send(params)
	if err != nil {
		return err
	}
	return nil
}
