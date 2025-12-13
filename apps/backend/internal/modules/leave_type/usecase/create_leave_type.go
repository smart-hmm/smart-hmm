package leavetypeusecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/smart-hmm/smart-hmm/internal/modules/leave_type/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/repository"
)

type CreateLeaveTypeUsecase struct {
	repo leaverepository.LeaveTypeRepository
}

func NewCreateLeaveTypeUsecase(repo leaverepository.LeaveTypeRepository) *CreateLeaveTypeUsecase {
	return &CreateLeaveTypeUsecase{repo: repo}
}

func (uc *CreateLeaveTypeUsecase) Execute(ctx context.Context, name string, defaultDays int, isPaid bool) (*domain.LeaveType, error) {
	t := &domain.LeaveType{
		ID:          uuid.NewString(),
		Name:        name,
		DefaultDays: defaultDays,
		IsPaid:      isPaid,
		CreatedAt:   time.Now().UTC(),
		UpdatedAt:   time.Now().UTC(),
	}
	err := uc.repo.Create(t)
	return t, err
}
