package domain

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type EmailTemplate struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	Subject string `json:"subject"`
	Body    string `json:"body"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}

func NewEmailTemplate(name, subject, body string) (*EmailTemplate, error) {
	if name == "" {
		return nil, errors.New("template name required")
	}
	if subject == "" {
		return nil, errors.New("template subject required")
	}
	if body == "" {
		return nil, errors.New("template body required")
	}

	now := time.Now()

	return &EmailTemplate{
		ID:        uuid.NewString(),
		Name:      name,
		Subject:   subject,
		Body:      body,
		CreatedAt: now,
		UpdatedAt: now,
	}, nil
}

func (t *EmailTemplate) Update(name, subject, body string) error {
	if name == "" {
		return errors.New("template name required")
	}
	if subject == "" {
		return errors.New("template subject required")
	}
	if body == "" {
		return errors.New("template body required")
	}

	t.Name = name
	t.Subject = subject
	t.Body = body
	t.UpdatedAt = time.Now()

	return nil
}

func (t *EmailTemplate) SoftDelete() {
	now := time.Now()
	t.DeletedAt = &now
}
