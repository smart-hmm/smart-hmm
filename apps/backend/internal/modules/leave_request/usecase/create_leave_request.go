package leaverequestusecase

import (
	"context"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave_request/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/repository"
)

type CreateLeaveRequestUsecase struct {
	repo leaverepository.LeaveRequestRepository
}

func NewCreateLeaveRequestUsecase(repo leaverepository.LeaveRequestRepository) *CreateLeaveRequestUsecase {
	return &CreateLeaveRequestUsecase{repo: repo}
}

func (uc *CreateLeaveRequestUsecase) Execute(ctx context.Context, employeeID, leaveTypeID, reason string, start, end time.Time) (*domain.LeaveRequest, error) {
	req, err := domain.NewLeaveRequest(employeeID, leaveTypeID, reason, start, end)
	if err != nil {
		return nil, err
	}

	err = uc.repo.Create(req)
	return req, err
}
