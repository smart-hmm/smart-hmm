package attendanceddomain

import "time"

type ClockMethod string

const (
	ClockMethodManual ClockMethod = "MANUAL"
	ClockMethodDevice ClockMethod = "DEVICE"
)

type AttendanceRecord struct {
	ID          string
	EmployeeID  string
	ClockIn     time.Time
	ClockOut    *time.Time
	TotalHours  float64
	ClockMethod ClockMethod
	Note        *string

	CreatedAt time.Time
	UpdatedAt time.Time
}
