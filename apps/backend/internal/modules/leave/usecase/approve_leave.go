package leavetypesusecase

import (
	"context"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave/repository"
)

type ApproveLeaveUsecase struct {
	repo leaverepository.LeaveRequestRepository
}

func NewApproveLeaveUsecase(repo leaverepository.LeaveRequestRepository) *ApproveLeaveUsecase {
	return &ApproveLeaveUsecase{repo: repo}
}

func (uc *ApproveLeaveUsecase) Execute(ctx context.Context, r *domain.LeaveRequest, adminID string) error {
	now := time.Now()

	r.Status = domain.Approved
	r.ApprovedBy = &adminID
	r.ApprovedAt = &now

	return uc.repo.Update(r)
}
