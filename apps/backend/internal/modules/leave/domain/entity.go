package domain

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

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

func (t *LeaveType) Update(name string, defaultDays int, isPaid bool) error {
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

func NewLeaveRequest(empID, leaveTypeID, reason string, start, end time.Time) (*LeaveRequest, error) {
	if empID == "" || leaveTypeID == "" {
		return nil, errors.New("employeeID and leaveTypeID required")
	}
	if end.Before(start) {
		return nil, errors.New("end date cannot be before start date")
	}

	now := time.Now()
	return &LeaveRequest{
		ID:          uuid.NewString(),
		EmployeeID:  empID,
		LeaveTypeID: leaveTypeID,
		StartDate:   start,
		EndDate:     end,
		Reason:      reason,
		Status:      Pending,
		CreatedAt:   now,
		UpdatedAt:   now,
	}, nil
}

func (r *LeaveRequest) Approve(adminID string) error {
	if r.Status != Pending {
		return errors.New("request is not pending")
	}
	if adminID == "" {
		return errors.New("adminID required")
	}

	now := time.Now()
	r.Status = Approved
	r.ApprovedBy = &adminID
	r.ApprovedAt = &now
	r.UpdatedAt = now
	return nil
}
