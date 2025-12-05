package domain

import (
	"errors"
	"time"
)

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

	FirstName   string     `json:"firstName"`
	LastName    string     `json:"lastName"`
	Email       string     `json:"email"`
	Phone       string     `json:"phone,omitempty"`
	DateOfBirth *time.Time `json:"dateOfBirth,omitempty"`

	DepartmentID *string `json:"departmentID"`
	ManagerID    *string `json:"managerID"`

	Position         string           `json:"position"`
	EmploymentType   EmploymentType   `json:"employmentType"`
	EmploymentStatus EmploymentStatus `json:"employmentStatus"`
	JoinDate         time.Time        `json:"joinDate"`

	BaseSalary float64 `json:"baseSalary"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewEmployee(code, firstName, lastName, email, phone, position string, base float64) (*Employee, error) {
	if code == "" || firstName == "" || email == "" {
		return nil, errors.New("missing required fields")
	}
	if base < 0 {
		return nil, errors.New("base salary cannot be negative")
	}

	now := time.Now()

	return &Employee{
		Code:       code,
		FirstName:  firstName,
		LastName:   lastName,
		Email:      email,
		BaseSalary: base,
		JoinDate:   now,
		Position:   position,
		Phone:      phone,
		CreatedAt:  now,
		UpdatedAt:  now,
	}, nil
}

func (e *Employee) UpdatePosition(pos string) {
	e.Position = pos
	e.UpdatedAt = time.Now()
}
