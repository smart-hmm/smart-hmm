package leavetypeusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave_type/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/repository"
)

type GetLeaveTypeUsecase struct {
	repo leaverepository.LeaveTypeRepository
}

func NewGetLeaveTypeUsecase(repo leaverepository.LeaveTypeRepository) *GetLeaveTypeUsecase {
	return &GetLeaveTypeUsecase{repo: repo}
}

func (uc *GetLeaveTypeUsecase) Execute(ctx context.Context, id string) (*domain.LeaveType, error) {
	return uc.repo.FindByID(id)
}
