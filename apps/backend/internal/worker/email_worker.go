package worker

import (
	"context"
	"encoding/json"
	"errors"
	"log"

	mailports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/mail"
	queueports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/queue"
)

const SendEmailTopic = "send_mail"

type SendEmailPayload struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

type SendEmailWorker struct {
	mailer mailports.MailService
}

func NewSendEmailWorker(mailer mailports.MailService) *SendEmailWorker {
	return &SendEmailWorker{
		mailer: mailer,
	}
}

func (w *SendEmailWorker) Handle(
	ctx context.Context,
	msg queueports.Message,
) error {
	var payload SendEmailPayload

	if err := json.Unmarshal(msg.Body, &payload); err != nil {
		log.Println("invalid email payload:", err)
		return err
	}

	if payload.To == "" {
		return errors.New("missing email recipient")
	}

	log.Println("sending email to:", payload.To)

	err := w.mailer.SendPlain(
		ctx,
		[]string{payload.To},
		payload.Subject,
		payload.Body,
	)

	if err != nil {
		log.Println("send email failed:", err)
		return err
	}

	log.Println("email sent successfully to:", payload.To)
	return nil // ACK
}
