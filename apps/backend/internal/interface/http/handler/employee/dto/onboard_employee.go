package employeehandlerdto

import userdomain "github.com/smart-hmm/smart-hmm/internal/modules/user/domain"

type OnboardEmployeeRequest struct {
	Code       string              `json:"code" validate:"required"`
	FirstName  string              `json:"first_name" validate:"required"`
	LastName   string              `json:"last_name" validate:"required"`
	Email      string              `json:"email" validate:"required,email"`
	Position   string              `json:"position" validate:"required"`
	Phone      string              `json:"phone" validate:"required"`
	BaseSalary float64             `json:"base_salary" validate:"required"`
	CreateUser bool                `json:"create_user"`
	UserEmail  string              `json:"user_email" validate:"required_if=CreateUser true,email"`
	Password   string              `json:"password" validate:"required_if=CreateUser true"`
	Role       userdomain.UserRole `json:"role" validate:"required_if=CreateUser true,oneof=ADMIN HR MANAGER EMPLOYEE"`
}
