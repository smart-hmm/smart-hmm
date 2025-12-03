package leaverequestusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave_request/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/repository"
)

type ListByEmployee struct {
	repo leaverepository.LeaveRequestRepository
}

func NewListByEmployee(repo leaverepository.LeaveRequestRepository) *ListByEmployee {
	return &ListByEmployee{repo: repo}
}

func (uc *ListByEmployee) Execute(ctx context.Context, employeeID string) ([]*domain.LeaveRequest, error) {
	requests, err := uc.repo.ListByEmployee(employeeID)
	if err != nil {
		return nil, err
	}
	return requests, nil
}
