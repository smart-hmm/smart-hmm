package leavetypeusecase

import (
	"context"

	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/repository"
)

type ListAllLeaveTypesUsecase struct {
	repo leaverepository.LeaveTypeRepository
}

func NewListLeaveTypesUsecase(repo leaverepository.LeaveTypeRepository) *ListAllLeaveTypesUsecase {
	return &ListAllLeaveTypesUsecase{repo: repo}
}

func (uc *ListAllLeaveTypesUsecase) Execute(ctx context.Context) (any, error) {
	return uc.repo.ListAll()
}
