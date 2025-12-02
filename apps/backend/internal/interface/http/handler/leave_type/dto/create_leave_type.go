package leavetypehandlerdto

type CreateLeaveTypeRequest struct {
	Name        string `json:"name" validate:"required"`
	IsPaid      bool   `json:"is_paid" validate:"required"`
	DefaultDays int    `json:"default_days" validate:"required"`
}
