package userdomain

import "time"

type UserRole string

const (
	Admin    UserRole = "ADMIN"
	HR       UserRole = "HR"
	Manager  UserRole = "MANAGER"
	Employee UserRole = "EMPLOYEE"
)

type User struct {
	ID           string
	Email        string
	PasswordHash string
	Role         UserRole
	EmployeeID   *string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
