package leavetyperepository

import (
	"github.com/smart-hmm/smart-hmm/internal/modules/leave_type/domain"
)

type LeaveTypeRepository interface {
	Create(t *domain.LeaveType) error
	Update(t *domain.LeaveType) error

	FindByID(id string) (*domain.LeaveType, error)
	FindByName(name string) (*domain.LeaveType, error)

	ListAll() ([]*domain.LeaveType, error)
	SoftDelete(id string) error
}
