package repository

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
	employeerepository "github.com/smart-hmm/smart-hmm/internal/modules/employee/repository"
)

type EmployeePostgresRepository struct {
	db *pgxpool.Pool
}

func NewEmployeePostgresRepository(db *pgxpool.Pool) employeerepository.EmployeeRepository {
	return &EmployeePostgresRepository{db: db}
}

func (r *EmployeePostgresRepository) Create(e *domain.Employee) (string, error) {
	var id string
	err := r.db.QueryRow(context.Background(),
		`INSERT INTO employees
	 (code, first_name, last_name, email, phone, date_of_birth, 
	  position, employment_type, employment_status, join_date, base_salary)
	 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
	 RETURNING id`,
		e.Code, e.FirstName, e.LastName, e.Email, e.Phone, e.DateOfBirth,
		e.Position, domain.FullTime, domain.Active,
		e.JoinDate, e.BaseSalary,
	).Scan(&id)

	if err != nil {
		return "", err
	}

	return id, nil
}

func (r *EmployeePostgresRepository) Delete(id string) error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM employees WHERE id = $1`, id)
	return err
}

func (r *EmployeePostgresRepository) Update(e *domain.Employee) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE employees SET
		 code=$1, first_name=$2, last_name=$3, email=$4, phone=$5,
		 date_of_birth=$6, department_id=$7, manager_id=$8, position=$9,
		 employment_type=$10, employment_status=$11,
		 join_date=$12, base_salary=$13
		 WHERE id=$14`,
		e.Code, e.FirstName, e.LastName, e.Email, e.Phone,
		e.DateOfBirth, e.DepartmentID, e.ManagerID, e.Position,
		e.EmploymentType, e.EmploymentStatus, e.JoinDate, e.BaseSalary,
		e.ID)
	return err
}

func ScanEmployee(row pgx.Row) (*domain.Employee, error) {
	var e domain.Employee
	err := row.Scan(
		&e.ID, &e.Code, &e.FirstName, &e.LastName, &e.Email, &e.Phone,
		&e.DateOfBirth, &e.DepartmentID, &e.ManagerID, &e.Position,
		&e.EmploymentType, &e.EmploymentStatus, &e.JoinDate, &e.BaseSalary,
		&e.CreatedAt, &e.UpdatedAt, &e.DepartmentName,
	)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *EmployeePostgresRepository) Find(name, email, code, departmentID string,
) ([]*domain.Employee, error) {

	var (
		orClauses  []string
		andClauses []string
		args       []any
		idx        = 1
	)

	if name != "" {
		orClauses = append(orClauses,
			fmt.Sprintf(`
				(
					e.first_name ILIKE $%d OR 
					e.last_name ILIKE $%d OR 
					(e.first_name || ' ' || e.last_name) ILIKE $%d
				)
			`, idx, idx+1, idx+2),
		)

		pattern := "%" + name + "%"
		args = append(args, pattern, pattern, pattern)
		idx += 3
	}

	if email != "" {
		orClauses = append(orClauses,
			fmt.Sprintf("e.email ILIKE $%d", idx),
		)
		args = append(args, "%"+email+"%")
		idx++
	}

	if code != "" {
		orClauses = append(orClauses,
			fmt.Sprintf("e.code ILIKE $%d", idx),
		)
		args = append(args, "%"+code+"%")
		idx++
	}

	if len(orClauses) > 0 {
		andClauses = append(andClauses, "("+strings.Join(orClauses, " OR ")+")")
	}

	if departmentID != "" {
		andClauses = append(andClauses,
			fmt.Sprintf("e.department_id = $%d", idx),
		)
		args = append(args, departmentID)
		idx++
	}

	query := `
		SELECT e.id, e.code, e.first_name, e.last_name, e.email, e.phone, e.date_of_birth,
		       e.department_id, e.manager_id, e.position, e.employment_type,
		       e.employment_status, e.join_date, e.base_salary,
		       e.created_at, e.updated_at, d.name
		FROM employees e
		LEFT JOIN departments d ON e.department_id = d.id
	`

	if len(andClauses) > 0 {
		query += " WHERE " + strings.Join(andClauses, " AND ")
	}

	rows, err := r.db.Query(context.Background(), query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*domain.Employee
	for rows.Next() {
		e, err := ScanEmployee(rows)
		if err != nil {
			return nil, err
		}
		result = append(result, e)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *EmployeePostgresRepository) FindByID(id string) (*domain.Employee, error) {
	return ScanEmployee(
		r.db.QueryRow(context.Background(),
			`SELECT e.id, e.code, e.first_name, e.last_name, e.email, e.phone, e.date_of_birth,
		       e.department_id, e.manager_id, e.position, e.employment_type,
		       e.employment_status, e.join_date, e.base_salary,
		       e.created_at, e.updated_at, d.name
			FROM employees e
			LEFT JOIN departments d ON e.department_id = d.id 
			WHERE e.id = $1`, id),
	)
}

func (r *EmployeePostgresRepository) FindByEmail(email string) (*domain.Employee, error) {
	return ScanEmployee(
		r.db.QueryRow(context.Background(),
			`SELECT id, code, first_name, last_name, email, phone, date_of_birth,
			        department_id, manager_id, position, employment_type,
			        employment_status, join_date, base_salary,
			        created_at, updated_at
			       FROM employees WHERE email=$1`, email),
	)
}

func (r *EmployeePostgresRepository) FindByCode(code string) (*domain.Employee, error) {
	return ScanEmployee(
		r.db.QueryRow(context.Background(),
			`SELECT id, code, first_name, last_name, email, phone, date_of_birth,
			        department_id, manager_id, position, employment_type,
			        employment_status, join_date, base_salary,
			        created_at, updated_at
			       FROM employees WHERE code=$1`, code),
	)
}

func (r *EmployeePostgresRepository) ListAll() ([]*domain.Employee, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT e.id, code, first_name, last_name, email, phone, date_of_birth,
		        department_id, e.manager_id, position, employment_type,
		        employment_status, join_date, base_salary,
		        e.created_at, e.updated_at, d.name
		   FROM employees e 
		   LEFT JOIN departments d 
		   ON e.department_id = d.id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*domain.Employee
	for rows.Next() {
		e, err := ScanEmployee(rows)
		if err != nil {
			return nil, err
		}
		result = append(result, e)
	}
	return result, nil
}

func (r *EmployeePostgresRepository) ListByDepartment(deptID string) ([]*domain.Employee, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT e.id, code, first_name, last_name, email, phone, date_of_birth,
		        department_id, e.manager_id, position, employment_type,
		        employment_status, join_date, base_salary,
		        e.created_at, e.updated_at, d.name
		   FROM employees e 
		   LEFT JOIN departments d 
		   ON e.department_id = d.id WHERE department_id=$1`, deptID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []*domain.Employee
	for rows.Next() {
		e, err := ScanEmployee(rows)
		if err != nil {
			return nil, err
		}
		result = append(result, e)
	}
	return result, nil
}
