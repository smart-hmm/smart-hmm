package payrollrepository

import domain "github.com/smart-hmm/smart-hmm/internal/modules/payroll/domain"

type PayrollRepository interface {
	Create(p *domain.PayrollRecord) error
	Update(p *domain.PayrollRecord) error

	FindByID(id string) (*domain.PayrollRecord, error)
	ListByEmployee(employeeID string) ([]*domain.PayrollRecord, error)
	ListByPeriod(period string) ([]*domain.PayrollRecord, error)
}
