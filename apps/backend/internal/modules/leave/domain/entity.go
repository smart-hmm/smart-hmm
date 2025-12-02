package domain

import "time"

type LeaveStatus string

const (
	Pending  LeaveStatus = "PENDING"
	Approved LeaveStatus = "APPROVED"
	Rejected LeaveStatus = "REJECTED"
)

type LeaveType struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	DefaultDays int    `json:"default_days"`
	IsPaid      bool   `json:"is_paid"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type LeaveRequest struct {
	ID          string `json:"id"`
	EmployeeID  string `json:"employee_id"`
	LeaveTypeID string `json:"leave_type_id"`

	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Reason    string    `json:"reason"`

	Status     LeaveStatus `json:"status"`
	ApprovedBy *string     `json:"approved_by,omitempty"`
	ApprovedAt *time.Time  `json:"approved_at,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
