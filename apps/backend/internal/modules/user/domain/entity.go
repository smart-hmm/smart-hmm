package domain

import "time"

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

	EmployeeID *string `json:"employee_id,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
