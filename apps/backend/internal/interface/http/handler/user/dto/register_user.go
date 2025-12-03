package userhandlerdto

import "github.com/smart-hmm/smart-hmm/internal/modules/user/domain"

type RegisterUserRequest struct {
	Email      string          `json:"email" validate:"required"`
	Password   string          `json:"password_hash" validate:"required"`
	Role       domain.UserRole `json:"role" validate:"required"`
	EmployeeID *string         `json:"employee_id" validate:"required"`
}
