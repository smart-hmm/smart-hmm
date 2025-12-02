package domain

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type Department struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	ManagerID *string `json:"manager_id"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func NewDepartment(name string, managerID *string) (*Department, error) {
	if name == "" {
		return nil, errors.New("name required")
	}

	now := time.Now()

	return &Department{
		ID:        uuid.NewString(),
		Name:      name,
		ManagerID: managerID,
		CreatedAt: now,
		UpdatedAt: now,
	}, nil
}

func (d *Department) ChangeManager(managerID *string) {
	d.ManagerID = managerID
	d.UpdatedAt = time.Now()
}
