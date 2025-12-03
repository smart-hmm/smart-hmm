package leaverequestusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave_request/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/repository"
)

type GetLeaveRequest struct {
	repo leaverepository.LeaveRequestRepository
}

func NewGetLeaveRequest(repo leaverepository.LeaveRequestRepository) *GetLeaveRequest {
	return &GetLeaveRequest{repo: repo}
}

func (uc *GetLeaveRequest) Execute(ctx context.Context, id string) (*domain.LeaveRequest, error) {
	request, err := uc.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return request, nil
}
