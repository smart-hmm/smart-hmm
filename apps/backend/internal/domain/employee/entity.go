package employeedomain

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
	ID          string
	Code        string
	FirstName   string
	LastName    string
	Email       string
	Phone       string
	DateOfBirth *time.Time

	DepartmentID string
	ManagerID    *string

	Position       string
	EmploymentType EmploymentType
	JoinDate       time.Time
	Status         EmploymentStatus

	BaseSalary float64

	CreatedAt time.Time
	UpdatedAt time.Time
}
