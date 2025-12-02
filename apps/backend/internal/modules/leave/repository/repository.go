package leaverepository

import (
	domain "github.com/smart-hmm/smart-hmm/internal/modules/leave/domain"
)

type LeaveTypeRepository interface {
	Create(t *domain.LeaveType) error
	Update(t *domain.LeaveType) error

	FindByID(id string) (*domain.LeaveType, error)
	FindByName(name string) (*domain.LeaveType, error)

	ListAll() ([]*domain.LeaveType, error)
}

type LeaveRequestRepository interface {
	Create(r *domain.LeaveRequest) error
	Update(r *domain.LeaveRequest) error

	FindByID(id string) (*domain.LeaveRequest, error)
	ListByEmployee(employeeID string) ([]*domain.LeaveRequest, error)
	ListByStatus(status string) ([]*domain.LeaveRequest, error)
}
