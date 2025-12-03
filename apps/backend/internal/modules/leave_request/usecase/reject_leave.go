package leaverequestusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave_request/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/repository"
)

type RejectLeaveUsecase struct {
	repo leaverepository.LeaveRequestRepository
}

func NewRejectLeaveUsecase(repo leaverepository.LeaveRequestRepository) *RejectLeaveUsecase {
	return &RejectLeaveUsecase{repo: repo}
}

func (uc *RejectLeaveUsecase) Execute(ctx context.Context, r *domain.LeaveRequest, adminID, reason string) error {
	if err := r.RejectLeaveRequest(adminID, reason); err != nil {
		return err
	}
	return uc.repo.Update(r)
}
