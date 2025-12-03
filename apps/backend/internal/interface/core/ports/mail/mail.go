package mailports

import "context"

type MailService interface {
	SendPlain(ctx context.Context, to []string, subject, text string) error
	SendHTML(ctx context.Context, to []string, subject, html string) error
}
