package domain

import "time"

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
