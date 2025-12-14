package domain

import (
	"errors"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

var (
	ErrTenantAlreadyDeleted = errors.New("tenant already deleted")
	ErrUnauthorized         = errors.New("user dont have permissions to access this tenant")
)

var validate = validator.New(validator.WithRequiredStructEnabled())

type Tenant struct {
	ID            string     `json:"id"`
	Name          string     `json:"name" validate:"required"`
	WorkspaceSlug string     `json:"workspaceSlug" validate:"required"`
	OwnerID       *string    `json:"ownerId,omitempty" validate:"uuid"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	DeletedAt     *time.Time `json:"deletedAt,omitempty"`
}

func init() {
	validate.RegisterValidation("uuid", func(fl validator.FieldLevel) bool {
		_, err := uuid.Parse(fl.Field().String())
		return err == nil
	})
}

func (t *Tenant) validateForCreate() error {
	return validate.Struct(t)
}

func NewTenant(name, slug, userID string) (*Tenant, error) {
	now := time.Now().UTC()

	tenant := &Tenant{
		Name:          name,
		WorkspaceSlug: normalizeSlug(slug),
		OwnerID:       &userID,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	if err := tenant.validateForCreate(); err != nil {
		return nil, err
	}

	return tenant, nil
}

func (t *Tenant) Update(name, slug string) {
	if name != "" {
		t.Name = name
	}

	if slug != "" {
		t.WorkspaceSlug = normalizeSlug(slug)
	}

	t.UpdatedAt = time.Now().UTC()
}

func (t *Tenant) Delete() error {
	if t.IsDeleted() {
		return ErrTenantAlreadyDeleted
	}

	now := time.Now().UTC()
	t.DeletedAt = &now
	t.UpdatedAt = now

	return nil
}

func (t *Tenant) IsDeleted() bool {
	return t.DeletedAt != nil
}

func normalizeSlug(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = strings.ReplaceAll(s, " ", "-")
	return s
}
