package domain

import (
	"errors"
	"time"

	empDomain "github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
)

type Department struct {
	ID             string              `json:"id"`
	Name           string              `json:"name"`
	ManagerID      *string             `json:"managerId,omitempty"`
	Manager        *empDomain.Employee `json:"manager,omitempty"`
	TotalEmployees *int                `json:"totalEmployees,omitempty"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewDepartment(name string, managerID *string) (*Department, error) {
	if name == "" {
		return nil, errors.New("name required")
	}

	now := time.Now().UTC()

	return &Department{
		Name:      name,
		ManagerID: managerID,
		CreatedAt: now,
		UpdatedAt: now,
	}, nil
}

func (d *Department) ChangeManager(managerID *string) {
	d.ManagerID = managerID
	d.UpdatedAt = time.Now().UTC()
}
