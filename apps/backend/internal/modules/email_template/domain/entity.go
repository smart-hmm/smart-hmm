package domain

import (
	"time"

	"github.com/google/uuid"
)

type Template struct {
	ID          uuid.UUID
	Key         string
	Name        string
	Description *string

	CreatedAt time.Time
	UpdatedAt time.Time
}

type TemplateVersion struct {
	ID         uuid.UUID
	TemplateID uuid.UUID

	Version int
	Locale  string
	Channel TemplateChannel

	Subject  *string
	BodyHTML *string
	BodyText *string

	Status TemplateStatus

	CreatedBy *uuid.UUID
	CreatedAt time.Time
}

type TemplateVariable struct {
	ID         uuid.UUID
	TemplateID uuid.UUID

	Key      string
	Desc     *string
	Required bool

	CreatedAt time.Time
}

func NewTemplate(
	key string,
	name string,
	description *string,
) (*Template, error) {
	if key == "" {
		return nil, ErrTemplateKeyRequired
	}

	if name == "" {
		return nil, ErrTemplateNameRequired
	}

	return &Template{
		ID:          uuid.New(),
		Key:         key,
		Name:        name,
		Description: description,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}, nil
}

func NewTemplateVersion(
	templateID uuid.UUID,
	version int,
	locale string,
	channel TemplateChannel,
	subject *string,
	bodyHTML *string,
	bodyText *string,
	createdBy *uuid.UUID,
) (*TemplateVersion, error) {

	if templateID == uuid.Nil {
		return nil, ErrTemplateIDRequired
	}

	if version <= 0 {
		return nil, ErrInvalidTemplateVersion
	}

	if locale == "" {
		locale = "en"
	}

	if channel == "" {
		return nil, ErrTemplateChannelRequired
	}

	return &TemplateVersion{
		ID:         uuid.New(),
		TemplateID: templateID,
		Version:    version,
		Locale:     locale,
		Channel:    channel,
		Subject:    subject,
		BodyHTML:   bodyHTML,
		BodyText:   bodyText,
		Status:     TemplateStatusDraft,
		CreatedBy:  createdBy,
		CreatedAt:  time.Now(),
	}, nil
}

func NewTemplateVariable(
	templateID uuid.UUID,
	key string,
	description *string,
	required bool,
) (*TemplateVariable, error) {

	if templateID == uuid.Nil {
		return nil, ErrTemplateIDRequired
	}

	if key == "" {
		return nil, ErrTemplateVariableKeyRequired
	}

	return &TemplateVariable{
		ID:         uuid.New(),
		TemplateID: templateID,
		Key:        key,
		Desc:       description,
		Required:   required,
		CreatedAt:  time.Now(),
	}, nil
}
