package attendancerepository

import domain "github.com/smart-hmm/smart-hmm/internal/modules/attendance/domain"

type AttendanceRepository interface {
	Create(record *domain.AttendanceRecord) error
	Update(record *domain.AttendanceRecord) error

	FindByID(id string) (*domain.AttendanceRecord, error)
	ListByEmployee(employeeID string) ([]*domain.AttendanceRecord, error)
	ListByDateRange(employeeID string, start, end string) ([]*domain.AttendanceRecord, error)
}
