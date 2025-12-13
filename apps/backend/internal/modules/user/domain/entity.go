package domain

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type UserRole string

const (
	Admin    UserRole = "ADMIN"
	HR       UserRole = "HR"
	Manager  UserRole = "MANAGER"
	Employee UserRole = "EMPLOYEE"
)

type User struct {
	ID           string   `json:"id"`
	Email        string   `json:"email"`
	PasswordHash string   `json:"-"`
	Role         UserRole `json:"role"`

	EmployeeID *string `json:"employeeID,omitempty"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewUser(email, hashedPassword string, role UserRole, employeeID *string) (*User, error) {
	if email == "" {
		return nil, errors.New("email required")
	}

	now := time.Now().UTC()

	return &User{
		ID:           uuid.NewString(),
		Email:        email,
		PasswordHash: hashedPassword,
		Role:         role,
		EmployeeID:   employeeID,
		CreatedAt:    now,
		UpdatedAt:    now,
	}, nil
}

func (u *User) ChangePassword(newHash string) {
	u.PasswordHash = newHash
	u.UpdatedAt = time.Now().UTC()
}
