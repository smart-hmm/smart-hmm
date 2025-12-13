package domain

import "errors"

var (
	ErrInvalidTenantRole         = errors.New("invalid tenant role")
	ErrRoleAlreadyAssigned       = errors.New("role already assigned")
	ErrTenantMemberAlreadyExists = errors.New("tenant member already exists")
	ErrPermissionDenied          = errors.New("permission denied")
	ErrSelfRoleChangeDenied      = errors.New("cannot change your own role")
	ErrTenantMemberNotFound      = errors.New("tenant member not found")
	ErrLastOwnerRemovalDenied    = errors.New("cannot remove the last owner")
)
