package repository

import (
	"context"
	"slices"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/department/domain"
	departmentrepository "github.com/smart-hmm/smart-hmm/internal/modules/department/repository"
	empDomain "github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
)

type DepartmentPostgresRepository struct {
	db *pgxpool.Pool
}

func NewDepartmentPostgresRepository(db *pgxpool.Pool) departmentrepository.DepartmentRepository {
	return &DepartmentPostgresRepository{db: db}
}

func (r *DepartmentPostgresRepository) Create(d *domain.Department) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO departments (name, manager_id)
		 VALUES ($1, $2)`, d.Name, d.ManagerID,
	)
	return err
}

func (r *DepartmentPostgresRepository) Update(d *domain.Department) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE departments 
		 SET name = $1,
		     manager_id = $2,
		     updated_at = NOW()
		 WHERE id = $3`,
		d.Name, d.ManagerID, d.ID,
	)
	return err
}

func scanDepartment(row pgx.Row) (*domain.Department, error) {
	var d domain.Department
	var mgr *string

	err := row.Scan(
		&d.ID,
		&d.Name,
		&mgr,
		&d.CreatedAt,
		&d.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	d.ManagerID = mgr
	return &d, nil
}

func (r *DepartmentPostgresRepository) FindByID(id string) (*domain.Department, error) {
	return scanDepartment(
		r.db.QueryRow(context.Background(),
			`SELECT id, name, manager_id, created_at, updated_at
			 FROM departments WHERE id = $1`,
			id,
		),
	)
}

func (r *DepartmentPostgresRepository) FindByName(name string) (*domain.Department, error) {
	return scanDepartment(
		r.db.QueryRow(context.Background(),
			`SELECT id, name, manager_id, created_at, updated_at
			 FROM departments WHERE name = $1`,
			name,
		),
	)
}

func (r *DepartmentPostgresRepository) ListAll() ([]*domain.Department, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, name, manager_id, created_at, updated_at
		 FROM departments
		 ORDER BY name ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.Department

	for rows.Next() {
		item, err := scanDepartment(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	managerIds := make([]string, 0, len(results))
	for _, dep := range results {
		if dep.ManagerID != nil {
			managerIds = append(managerIds, *dep.ManagerID)
		}
	}

	departmentIds := make([]string, 0, len(results))
	for _, dep := range results {
		if dep.ManagerID != nil {
			departmentIds = append(departmentIds, dep.ID)
		}
	}

	var emps []*empDomain.Employee
	empRows, err := r.db.Query(context.Background(),
		`SELECT id, code, first_name, last_name FROM employees WHERE id = ANY($1)`, managerIds)
	if err == nil {
		for empRows.Next() {
			var emp empDomain.Employee
			err := empRows.Scan(
				&emp.ID,
				&emp.Code,
				&emp.FirstName,
				&emp.LastName,
			)
			if err == nil {
				emps = append(emps, &emp)
			}
		}
		for i, dep := range results {
			idx := slices.IndexFunc(emps, func(c *empDomain.Employee) bool { return c.ID == *dep.ManagerID })
			if idx != -1 {
				results[i].Manager = emps[idx]
			}
		}

	}

	type DepartmentTotalEmpCountItem struct {
		Total        int    `json:"total"`
		DepartmentId string `json:"departmentId"`
	}

	countRows, err := r.db.Query(context.Background(), `
		SELECT COUNT(department_id) total, department_id
		FROM employees
		WHERE department_id = ANY($1)
		GROUP BY department_id`, departmentIds)
	if err == nil {
		for countRows.Next() {
			var cItem DepartmentTotalEmpCountItem
			err := countRows.Scan(
				&cItem.Total,
				&cItem.DepartmentId,
			)
			if err == nil {
				idx := slices.IndexFunc(results, func(ele *domain.Department) bool {
					return ele.ID == cItem.DepartmentId
				})
				if idx != -1 {
					results[idx].TotalEmployees = &cItem.Total
				}
			}
		}
	}

	return results, nil
}
