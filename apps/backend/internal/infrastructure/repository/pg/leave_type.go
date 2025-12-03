package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/leave_type/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/repository"
)

type LeaveTypePostgresRepository struct {
	db *pgxpool.Pool
}

func NewLeaveTypePostgresRepository(db *pgxpool.Pool) leaverepository.LeaveTypeRepository {
	return &LeaveTypePostgresRepository{db: db}
}

func (r *LeaveTypePostgresRepository) Create(t *domain.LeaveType) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO leave_types (id, name, default_days, is_paid)
		 VALUES ($1, $2, $3, $4)`,
		t.ID, t.Name, t.DefaultDays, t.IsPaid,
	)
	return err
}

func (r *LeaveTypePostgresRepository) Update(t *domain.LeaveType) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE leave_types
		 SET name = $1,
		     default_days = $2,
		     is_paid = $3,
		     updated_at = NOW()
		 WHERE id = $4`,
		t.Name, t.DefaultDays, t.IsPaid, t.ID,
	)
	return err
}

func (r *LeaveTypePostgresRepository) FindByID(id string) (*domain.LeaveType, error) {
	return scanLeaveType(
		r.db.QueryRow(context.Background(),
			`SELECT id, name, default_days, is_paid, created_at, updated_at
			 FROM leave_types WHERE id = $1`,
			id,
		),
	)
}

func (r *LeaveTypePostgresRepository) FindByName(name string) (*domain.LeaveType, error) {
	return scanLeaveType(
		r.db.QueryRow(context.Background(),
			`SELECT id, name, default_days, is_paid, created_at, updated_at
			 FROM leave_types WHERE name = $1`,
			name,
		),
	)
}

func (r *LeaveTypePostgresRepository) ListAll() ([]*domain.LeaveType, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, name, default_days, is_paid, created_at, updated_at
		 FROM leave_types ORDER BY name ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.LeaveType

	for rows.Next() {
		item, err := scanLeaveType(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}

func (r *LeaveTypePostgresRepository) SoftDelete(id string) error {
	_, err := r.db.Exec(
		context.Background(),
		"UPDATE leave_types SET deleted_at = NULL WHERE id = $1",
		id,
	)
	return err
}

func scanLeaveType(row pgx.Row) (*domain.LeaveType, error) {
	var t domain.LeaveType
	err := row.Scan(
		&t.ID,
		&t.Name,
		&t.DefaultDays,
		&t.IsPaid,
		&t.CreatedAt,
		&t.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &t, nil
}
