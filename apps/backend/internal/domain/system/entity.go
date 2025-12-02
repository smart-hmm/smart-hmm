package systemdomain

import "time"

type SystemSetting struct {
	ID                     string
	WorkDays               []string // ["Mon", "Tue", "Wed", "Thu", "Fri"]
	DefaultAnnualLeaveDays int
	CreatedAt              time.Time
	UpdatedAt              time.Time
}
