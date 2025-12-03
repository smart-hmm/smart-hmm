package leaverequestusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave_request/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/repository"
)

type ListByStatus struct {
	repo leaverepository.LeaveRequestRepository
}

func NewListByStatus(repo leaverepository.LeaveRequestRepository) *ListByStatus {
	return &ListByStatus{repo: repo}
}

func (uc *ListByStatus) Execute(ctx context.Context, status string) ([]*domain.LeaveRequest, error) {
	requests, err := uc.repo.ListByStatus(status)
	if err != nil {
		return nil, err
	}
	return requests, nil
}
