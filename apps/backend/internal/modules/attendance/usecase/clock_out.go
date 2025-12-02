package attendanceusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/attendance/domain"
	attendancerepository "github.com/smart-hmm/smart-hmm/internal/modules/attendance/repository"
)

type ClockOutUsecase struct {
	repo attendancerepository.AttendanceRepository
}

func NewClockOutUsecase(repo attendancerepository.AttendanceRepository) *ClockOutUsecase {
	return &ClockOutUsecase{repo: repo}
}

func (uc *ClockOutUsecase) Execute(ctx context.Context, record *domain.AttendanceRecord) error {
	if err := record.ClockOutNow(); err != nil {
		return err
	}

	return uc.repo.Update(record)
}
