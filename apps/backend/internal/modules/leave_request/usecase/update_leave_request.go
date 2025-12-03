package leaverequestusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave_request/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/repository"
)

type UpdateLeaveRequestUsecase struct {
	repo leaverepository.LeaveRequestRepository
}

func NewUpdateLeaveRequestUsecase(repo leaverepository.LeaveRequestRepository) *UpdateLeaveRequestUsecase {
	return &UpdateLeaveRequestUsecase{repo: repo}
}

func (uc *UpdateLeaveRequestUsecase) Execute(ctx context.Context, r *domain.LeaveRequest) error {
	return uc.repo.Update(r)
}
