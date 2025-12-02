package domain

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type ClockMethod string

const (
	ClockMethodManual ClockMethod = "MANUAL"
	ClockMethodDevice ClockMethod = "DEVICE"
)

type AttendanceRecord struct {
	ID         string `json:"id"`
	EmployeeID string `json:"employee_id"`

	ClockIn    time.Time  `json:"clock_in"`
	ClockOut   *time.Time `json:"clock_out,omitempty"`
	TotalHours float64    `json:"total_hours"`

	Method ClockMethod `json:"method"`
	Note   *string     `json:"note,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func NewClockIn(employeeID string, method ClockMethod, note *string) (*AttendanceRecord, error) {
	if employeeID == "" {
		return nil, errors.New("employeeID is required")
	}

	now := time.Now()

	return &AttendanceRecord{
		ID:         uuid.NewString(),
		EmployeeID: employeeID,
		ClockIn:    now,
		Method:     method,
		Note:       note,
		CreatedAt:  now,
		UpdatedAt:  now,
	}, nil
}

func (a *AttendanceRecord) ClockOutNow() error {
	if a.ClockOut != nil {
		return errors.New("already clocked out")
	}

	now := time.Now()

	if now.Before(a.ClockIn) {
		return errors.New("clock-out cannot be before clock-in")
	}

	a.ClockOut = &now
	a.TotalHours = now.Sub(a.ClockIn).Hours()
	a.UpdatedAt = now

	return nil
}
