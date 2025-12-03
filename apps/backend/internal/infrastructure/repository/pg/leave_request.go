package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/leave_request/domain"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/repository"
)

type LeaveRequestPostgresRepository struct {
	db *pgxpool.Pool
}

func NewLeaveRequestPostgresRepository(db *pgxpool.Pool) leaverepository.LeaveRequestRepository {
	return &LeaveRequestPostgresRepository{db: db}
}

func (r *LeaveRequestPostgresRepository) Create(req *domain.LeaveRequest) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO leave_requests 
		 (id, employee_id, leave_type_id, start_date, end_date, reason, status, approved_by, approved_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
		req.ID,
		req.EmployeeID,
		req.LeaveTypeID,
		req.StartDate,
		req.EndDate,
		req.Reason,
		req.Status,
		req.ApprovedBy,
		req.ApprovedAt,
	)
	return err
}

func (r *LeaveRequestPostgresRepository) Update(req *domain.LeaveRequest) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE leave_requests
		 SET employee_id=$1,
		     leave_type_id=$2,
		     start_date=$3,
		     end_date=$4,
		     reason=$5,
		     status=$6,
		     approved_by=$7,
		     approved_at=$8,
		     updated_at=NOW()
		 WHERE id=$9`,
		req.EmployeeID,
		req.LeaveTypeID,
		req.StartDate,
		req.EndDate,
		req.Reason,
		req.Status,
		req.ApprovedBy,
		req.ApprovedAt,
		req.ID,
	)
	return err
}

func scanLeaveRequest(row pgx.Row) (*domain.LeaveRequest, error) {
	var lr domain.LeaveRequest
	var approvedBy *string
	var approvedAt *time.Time

	err := row.Scan(
		&lr.ID,
		&lr.EmployeeID,
		&lr.LeaveTypeID,
		&lr.StartDate,
		&lr.EndDate,
		&lr.Reason,
		&lr.Status,
		&approvedBy,
		&approvedAt,
		&lr.CreatedAt,
		&lr.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	lr.ApprovedBy = approvedBy
	lr.ApprovedAt = approvedAt
	return &lr, nil
}

func (r *LeaveRequestPostgresRepository) FindByID(id string) (*domain.LeaveRequest, error) {
	return scanLeaveRequest(
		r.db.QueryRow(context.Background(),
			`SELECT id, employee_id, leave_type_id, start_date, end_date, reason,
			        status, approved_by, approved_at, created_at, updated_at
			 FROM leave_requests
			 WHERE id=$1`,
			id,
		),
	)
}

func (r *LeaveRequestPostgresRepository) ListByEmployee(employeeID string) ([]*domain.LeaveRequest, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, employee_id, leave_type_id, start_date, end_date, reason,
		        status, approved_by, approved_at, created_at, updated_at
		 FROM leave_requests
		 WHERE employee_id=$1
		 ORDER BY start_date DESC`,
		employeeID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.LeaveRequest
	for rows.Next() {
		item, err := scanLeaveRequest(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}

func (r *LeaveRequestPostgresRepository) ListByStatus(status string) ([]*domain.LeaveRequest, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, employee_id, leave_type_id, start_date, end_date, reason,
		        status, approved_by, approved_at, created_at, updated_at
		 FROM leave_requests
		 WHERE status=$1
		 ORDER BY created_at DESC`,
		status,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.LeaveRequest
	for rows.Next() {
		item, err := scanLeaveRequest(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}
