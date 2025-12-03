package leavetypeusecase

import (
	"context"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave_type/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/repository"
)

type UpdateLeaveTypeUsecase struct {
	repo leaverepository.LeaveTypeRepository
}

func NewUpdateLeaveTypeUsecase(repo leaverepository.LeaveTypeRepository) *UpdateLeaveTypeUsecase {
	return &UpdateLeaveTypeUsecase{repo: repo}
}

func (uc *UpdateLeaveTypeUsecase) Execute(ctx context.Context, t *domain.LeaveType) error {
	t.UpdatedAt = time.Now()
	return uc.repo.Update(t)
}
