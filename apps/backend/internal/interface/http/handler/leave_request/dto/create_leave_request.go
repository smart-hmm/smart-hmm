package leaverequestdto

import "time"

type CreateLeaveRequestRequest struct {
	EmployeeID  string    `json:"employee_id" validate:"required"`
	LeaveTypeID string    `json:"leave_type_id" validate:"required"`
	Reason      string    `json:"reason" validate:"required"`
	StartDate   time.Time `json:"start_date" validate:"required"`
	EndDate     time.Time `json:"end_date" validate:"required"`
}
