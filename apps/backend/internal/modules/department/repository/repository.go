package departmentrepository

import domain "github.com/smart-hmm/smart-hmm/internal/modules/department/domain"

type DepartmentRepository interface {
	Create(d *domain.Department) error
	Update(d *domain.Department) error

	FindByID(id string) (*domain.Department, error)
	FindByName(name string) (*domain.Department, error)

	ListAll() ([]*domain.Department, error)
}
