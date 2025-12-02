package domain

import "time"

type EmploymentType string
type EmploymentStatus string

const (
	FullTime EmploymentType = "FULL_TIME"
	PartTime EmploymentType = "PART_TIME"
	Intern   EmploymentType = "INTERN"
	Contract EmploymentType = "CONTRACT"
)

const (
	Active   EmploymentStatus = "ACTIVE"
	Inactive EmploymentStatus = "INACTIVE"
	Resigned EmploymentStatus = "RESIGNED"
)

type Employee struct {
	ID   string `json:"id"`
	Code string `json:"code"`

	FirstName   string     `json:"first_name"`
	LastName    string     `json:"last_name"`
	Email       string     `json:"email"`
	Phone       string     `json:"phone,omitempty"`
	DateOfBirth *time.Time `json:"date_of_birth,omitempty"`

	DepartmentID string  `json:"department_id"`
	ManagerID    *string `json:"manager_id"`

	Position         string           `json:"position"`
	EmploymentType   EmploymentType   `json:"employment_type"`
	EmploymentStatus EmploymentStatus `json:"employment_status"`
	JoinDate         time.Time        `json:"join_date"`

	BaseSalary float64 `json:"base_salary"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
