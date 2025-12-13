package domain

import (
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

type TenantRole string

const (
	TenantOwnerRole  TenantRole = "OWNER"
	TenantAdminRole  TenantRole = "ADMIN"
	TenantMemberRole TenantRole = "MEMBER"
)

func (tr TenantRole) IsValid() bool {
	switch tr {
	case TenantAdminRole, TenantOwnerRole, TenantMemberRole:
		return true
	default:
		return false
	}
}

var validate = validator.New(validator.WithRequiredStructEnabled())

type TenantMember struct {
	TenantId  string     `json:"tenantId" validate:"required,uuid"`
	UserId    string     `json:"userId" validate:"required,uuid"`
	Role      TenantRole `json:"role" validate:"required,tenant_role"`
	CreatedAt time.Time  `json:"createdAt" validate:"required"`
}

func init() {
	validate.RegisterValidation("uuid", func(fl validator.FieldLevel) bool {
		_, err := uuid.Parse(fl.Field().String())
		return err == nil
	})

	validate.RegisterValidation("tenant_role", func(fl validator.FieldLevel) bool {
		return TenantRole(fl.Field().String()).IsValid()
	})
}

func NewTenantMember(tenantId, userId string, role TenantRole) (*TenantMember, error) {
	tenantMember := new(TenantMember)
	tenantMember.TenantId = tenantId
	tenantMember.UserId = userId
	tenantMember.Role = role
	tenantMember.CreatedAt = time.Now().UTC()

	if err := validate.Struct(tenantMember); err != nil {
		return nil, err
	}

	return tenantMember, nil
}

func (tm *TenantMember) UpdateMemberRole(newRole TenantRole) error {
	if isValid := newRole.IsValid(); !isValid {
		return ErrInvalidTenantRole
	}

	if tm.Role == newRole {
		return ErrRoleAlreadyAssigned
	}

	tm.Role = newRole

	return nil
}
