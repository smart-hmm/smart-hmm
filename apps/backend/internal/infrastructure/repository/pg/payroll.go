package repository

import (
	"context"
	"encoding/json"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/payroll/domain"
	payrollrepository "github.com/smart-hmm/smart-hmm/internal/modules/payroll/repository"
)

type PayrollPostgresRepository struct {
	db *pgxpool.Pool
}

func NewPayrollPostgresRepository(db *pgxpool.Pool) payrollrepository.PayrollRepository {
	return &PayrollPostgresRepository{db: db}
}

func (r *PayrollPostgresRepository) Create(p *domain.PayrollRecord) error {
	allowancesJSON, _ := json.Marshal(p.Allowances)
	deductionsJSON, _ := json.Marshal(p.Deductions)

	_, err := r.db.Exec(context.Background(),
		`INSERT INTO payroll_records 
		 (id, employee_id, period, base_salary, allowances, deductions, net_salary, generated_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
		p.ID,
		p.EmployeeID,
		p.Period,
		p.BaseSalary,
		allowancesJSON,
		deductionsJSON,
		p.NetSalary,
		p.GeneratedAt,
	)
	return err
}

func (r *PayrollPostgresRepository) Update(p *domain.PayrollRecord) error {
	allowancesJSON, _ := json.Marshal(p.Allowances)
	deductionsJSON, _ := json.Marshal(p.Deductions)

	_, err := r.db.Exec(context.Background(),
		`UPDATE payroll_records
		 SET employee_id=$1,
		     period=$2,
		     base_salary=$3,
		     allowances=$4,
		     deductions=$5,
		     net_salary=$6
		 WHERE id=$7`,
		p.EmployeeID,
		p.Period,
		p.BaseSalary,
		allowancesJSON,
		deductionsJSON,
		p.NetSalary,
		p.ID,
	)
	return err
}

func scanPayroll(row pgx.Row) (*domain.PayrollRecord, error) {
	var p domain.PayrollRecord
	var allowancesJSON []byte
	var deductionsJSON []byte

	err := row.Scan(
		&p.ID,
		&p.EmployeeID,
		&p.Period,
		&p.BaseSalary,
		&allowancesJSON,
		&deductionsJSON,
		&p.NetSalary,
		&p.GeneratedAt,
	)
	if err != nil {
		return nil, err
	}

	// Parse JSONB
	json.Unmarshal(allowancesJSON, &p.Allowances)
	json.Unmarshal(deductionsJSON, &p.Deductions)

	return &p, nil
}

func (r *PayrollPostgresRepository) FindByID(id string) (*domain.PayrollRecord, error) {
	return scanPayroll(
		r.db.QueryRow(context.Background(),
			`SELECT id, employee_id, period, base_salary, allowances, 
			        deductions, net_salary, generated_at
			 FROM payroll_records
			 WHERE id=$1`,
			id,
		),
	)
}

func (r *PayrollPostgresRepository) ListByEmployee(employeeID string) ([]*domain.PayrollRecord, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, employee_id, period, base_salary, allowances, 
		        deductions, net_salary, generated_at
		 FROM payroll_records
		 WHERE employee_id=$1
		 ORDER BY period DESC`,
		employeeID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.PayrollRecord

	for rows.Next() {
		item, err := scanPayroll(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}

func (r *PayrollPostgresRepository) ListByPeriod(period string) ([]*domain.PayrollRecord, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, employee_id, period, base_salary, allowances, 
		        deductions, net_salary, generated_at
		 FROM payroll_records
		 WHERE period=$1
		 ORDER BY employee_id ASC`,
		period,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.PayrollRecord

	for rows.Next() {
		item, err := scanPayroll(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}
