package leavetypesusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/leave/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave/repository"
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
