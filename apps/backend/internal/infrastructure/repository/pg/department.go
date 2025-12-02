package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/department/domain"
	departmentrepository "github.com/smart-hmm/smart-hmm/internal/modules/department/repository"
)

type DepartmentPostgresRepository struct {
	db *pgxpool.Pool
}

func NewDepartmentPostgresRepository(db *pgxpool.Pool) departmentrepository.DepartmentRepository {
	return &DepartmentPostgresRepository{db: db}
}

func (r *DepartmentPostgresRepository) Create(d *domain.Department) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO departments (id, name, manager_id)
		 VALUES ($1, $2, $3)`,
		d.ID, d.Name, d.ManagerID,
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

	return results, nil
}
