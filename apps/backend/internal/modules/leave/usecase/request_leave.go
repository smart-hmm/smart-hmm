package leavetypesusecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/smart-hmm/smart-hmm/internal/modules/leave/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave/repository"
)

type RequestLeaveUsecase struct {
	repo leaverepository.LeaveRequestRepository
}

func NewRequestLeaveUsecase(repo leaverepository.LeaveRequestRepository) *RequestLeaveUsecase {
	return &RequestLeaveUsecase{repo: repo}
}

func (uc *RequestLeaveUsecase) Execute(ctx context.Context, employeeID, leaveTypeID, reason string, start, end time.Time) (*domain.LeaveRequest, error) {
	req := &domain.LeaveRequest{
		ID:          uuid.NewString(),
		EmployeeID:  employeeID,
		LeaveTypeID: leaveTypeID,
		StartDate:   start,
		EndDate:     end,
		Reason:      reason,
		Status:      domain.Pending,
		CreatedAt:   time.Now(),
	}

	err := uc.repo.Create(req)
	return req, err
}
