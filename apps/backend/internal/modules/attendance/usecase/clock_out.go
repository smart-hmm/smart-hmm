package attendanceusecase

import (
	"context"
	"time"

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
	now := time.Now()

	record.ClockOut = &now
	record.TotalHours = now.Sub(record.ClockIn).Hours()

	return uc.repo.Update(record)
}
