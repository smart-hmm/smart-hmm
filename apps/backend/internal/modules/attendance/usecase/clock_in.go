package attendanceusecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/smart-hmm/smart-hmm/internal/modules/attendance/domain"
	attendancerepository "github.com/smart-hmm/smart-hmm/internal/modules/attendance/repository"
)

type ClockInUsecase struct {
	repo attendancerepository.AttendanceRepository
}

func NewClockInUsecase(repo attendancerepository.AttendanceRepository) *ClockInUsecase {
	return &ClockInUsecase{repo: repo}
}

func (uc *ClockInUsecase) Execute(ctx context.Context, employeeID string, method domain.ClockMethod) (*domain.AttendanceRecord, error) {
	record := &domain.AttendanceRecord{
		ID:         uuid.NewString(),
		EmployeeID: employeeID,
		ClockIn:    time.Now(),
		Method:     method,
		Note:       nil,
	}

	err := uc.repo.Create(record)
	return record, err
}
