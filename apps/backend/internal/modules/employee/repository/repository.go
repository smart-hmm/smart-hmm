package employeerepository

import domain "github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"

type EmployeeRepository interface {
	Create(e *domain.Employee) (string, error)
	Update(e *domain.Employee) error
	Delete(id string) error

	Find(tenantId, name, email, code string, departmentIds []string, page, limit int) ([]*domain.Employee, int, int, error)
	FindByID(id string) (*domain.Employee, error)
	FindByEmail(email string) (*domain.Employee, error)
	FindByCode(code string) (*domain.Employee, error)

	ListAll() ([]*domain.Employee, error)
	ListByDepartment(deptID string) ([]*domain.Employee, error)
}
