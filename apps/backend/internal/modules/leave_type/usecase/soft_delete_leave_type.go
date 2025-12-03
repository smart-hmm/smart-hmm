package leavetypeusecase

import (
	"context"

	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/repository"
)

type SoftDeleteLeaveTypeUsecase struct {
	repo leaverepository.LeaveTypeRepository
}

func NewSoftDeleteLeaveTypeUsecase(repo leaverepository.LeaveTypeRepository) *SoftDeleteLeaveTypeUsecase {
	return &SoftDeleteLeaveTypeUsecase{repo: repo}
}

func (uc *SoftDeleteLeaveTypeUsecase) Execute(ctx context.Context, id string) error {
	return uc.repo.SoftDelete(id)
}
