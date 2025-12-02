package attendanceusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/attendance/domain"
	attendancerepository "github.com/smart-hmm/smart-hmm/internal/modules/attendance/repository"
)

type ClockInUsecase struct {
	repo attendancerepository.AttendanceRepository
}

func NewClockInUsecase(repo attendancerepository.AttendanceRepository) *ClockInUsecase {
	return &ClockInUsecase{repo: repo}
}

func (uc *ClockInUsecase) Execute(ctx context.Context, employeeID string, method domain.ClockMethod, note *string) (*domain.AttendanceRecord, error) {
	record, err := domain.NewClockIn(employeeID, method, note)
	if err != nil {
		return nil, err
	}

	return record, uc.repo.Create(record)
}
