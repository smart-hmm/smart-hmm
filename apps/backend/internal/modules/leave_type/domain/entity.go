package domain

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type LeaveType struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	DefaultDays int    `json:"default_days"`
	IsPaid      bool   `json:"is_paid"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	DeletedAt time.Time `json:"deleted_at"`
}

func NewLeaveType(name string, defaultDays int, isPaid bool) (*LeaveType, error) {
	if name == "" {
		return nil, errors.New("leave type name required")
	}
	if defaultDays < 0 {
		return nil, errors.New("default days cannot be negative")
	}

	now := time.Now()

	return &LeaveType{
		ID:          uuid.NewString(),
		Name:        name,
		DefaultDays: defaultDays,
		IsPaid:      isPaid,
		CreatedAt:   now,
		UpdatedAt:   now,
	}, nil
}

func (t *LeaveType) UpdateLeaveType(name string, defaultDays int, isPaid bool) error {
	if name == "" {
		return errors.New("leave type name required")
	}
	if defaultDays < 0 {
		return errors.New("default days cannot be negative")
	}

	t.Name = name
	t.DefaultDays = defaultDays
	t.IsPaid = isPaid
	t.UpdatedAt = time.Now()

	return nil
}
