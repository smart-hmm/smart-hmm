package leaverequestrepository

import (
	"github.com/smart-hmm/smart-hmm/internal/modules/leave_request/domain"
)

type LeaveRequestRepository interface {
	Create(r *domain.LeaveRequest) error
	Update(r *domain.LeaveRequest) error

	FindByID(id string) (*domain.LeaveRequest, error)
	ListByEmployee(employeeID string) ([]*domain.LeaveRequest, error)
	ListByStatus(status string) ([]*domain.LeaveRequest, error)
}
