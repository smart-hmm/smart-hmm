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

	RejectedBy     *string
	RejectedReason *string
	RejectedAt     *time.Time

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
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

func (r *LeaveRequest) ApproveLeaveRequest(adminID string) error {
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

func (r *LeaveRequest) RejectLeaveRequest(adminID string, reason string) error {
	if r.Status != Pending {
		return errors.New("leave request must be pending to be rejected")
	}
	if adminID == "" {
		return errors.New("approver/admin ID is required")
	}
	if reason == "" {
		return errors.New("rejection reason is required")
	}

	now := time.Now()

	r.Status = Rejected
	r.RejectedBy = &adminID
	r.RejectedReason = &reason
	r.RejectedAt = &now
	r.UpdatedAt = now

	return nil
}
