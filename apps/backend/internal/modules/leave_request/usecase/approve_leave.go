package leaverequestusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave_request/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/repository"
)

type ApproveLeaveUsecase struct {
	repo leaverepository.LeaveRequestRepository
}

func NewApproveLeaveUsecase(repo leaverepository.LeaveRequestRepository) *ApproveLeaveUsecase {
	return &ApproveLeaveUsecase{repo: repo}
}

func (uc *ApproveLeaveUsecase) Execute(ctx context.Context, r *domain.LeaveRequest, adminID string) error {
	if err := r.ApproveLeaveRequest(adminID); err != nil {
		return err
	}
	return uc.repo.Update(r)
}
