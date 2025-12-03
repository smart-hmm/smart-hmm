package employeehandlerdto

import (
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
)

type UpdateEmployeeRequest struct {
	Code             string                  `json:"code" validate:"required"`
	FirstName        string                  `json:"first_name" validate:"required"`
	LastName         string                  `json:"last_name" validate:"required"`
	Email            string                  `json:"email" validate:"required"`
	Phone            string                  `json:"phone" validate:"required"`
	DateOfBirth      *time.Time              `json:"date_of_birth" validate:"required"`
	DepartmentID     string                  `json:"department_id" validate:"required"`
	ManagerID        *string                 `json:"manager_id" validate:"required"`
	Position         string                  `json:"position" validate:"required"`
	EmploymentType   domain.EmploymentType   `json:"employment_type" validate:"required"`
	EmploymentStatus domain.EmploymentStatus `json:"employment_status" validate:"required"`
	JoinDate         time.Time               `json:"join_date" validate:"required"`
	BaseSalary       float64                 `json:"base_salary" validate:"required"`
}
