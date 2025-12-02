package leavedomain

import "time"

type LeaveStatus string

const (
	Pending  LeaveStatus = "PENDING"
	Approved LeaveStatus = "APPROVED"
	Rejected LeaveStatus = "REJECTED"
)

type LeaveType struct {
	ID          string
	Name        string
	DefaultDays int
	IsPaid      bool
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type LeaveRequest struct {
	ID          string
	EmployeeID  string
	LeaveTypeID string
	StartDate   time.Time
	EndDate     time.Time
	Reason      string

	Status     LeaveStatus
	ApprovedBy *string
	ApprovedAt *time.Time

	CreatedAt time.Time
	UpdatedAt time.Time
}
