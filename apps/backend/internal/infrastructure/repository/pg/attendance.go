package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/attendance/domain"
	attendancerepository "github.com/smart-hmm/smart-hmm/internal/modules/attendance/repository"
)

type AttendancePostgresRepository struct {
	db *pgxpool.Pool
}

func NewAttendancePostgresRepository(db *pgxpool.Pool) attendancerepository.AttendanceRepository {
	return &AttendancePostgresRepository{db: db}
}

func (r *AttendancePostgresRepository) Create(record *domain.AttendanceRecord) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO attendance_records 
		 (id, employee_id, clock_in, clock_out, total_hours, method, note)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		record.ID,
		record.EmployeeID,
		record.ClockIn,
		record.ClockOut,
		record.TotalHours,
		record.Method,
		record.Note,
	)
	return err
}

func (r *AttendancePostgresRepository) Update(record *domain.AttendanceRecord) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE attendance_records 
		 SET employee_id = $1, clock_in = $2, clock_out = $3, 
		     total_hours = $4, method = $5, note = $6, updated_at = NOW()
		 WHERE id = $7`,
		record.EmployeeID,
		record.ClockIn,
		record.ClockOut,
		record.TotalHours,
		record.Method,
		record.Note,
		record.ID,
	)
	return err
}

func scanAttendance(row pgx.Row) (*domain.AttendanceRecord, error) {
	var r domain.AttendanceRecord
	var note *string
	var clockOut *time.Time

	err := row.Scan(
		&r.ID,
		&r.EmployeeID,
		&r.ClockIn,
		&clockOut,
		&r.TotalHours,
		&r.Method,
		&note,
		&r.CreatedAt,
		&r.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	r.ClockOut = clockOut
	r.Note = note
	return &r, nil
}

func (r *AttendancePostgresRepository) FindByID(id string) (*domain.AttendanceRecord, error) {
	return scanAttendance(
		r.db.QueryRow(context.Background(),
			`SELECT id, employee_id, clock_in, clock_out, total_hours,
	                method, note, created_at, updated_at
			 FROM attendance_records
			 WHERE id = $1`,
			id,
		),
	)
}

func (r *AttendancePostgresRepository) ListByEmployee(employeeID string) ([]*domain.AttendanceRecord, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, employee_id, clock_in, clock_out, total_hours,
		        method, note, created_at, updated_at
		   FROM attendance_records
		   WHERE employee_id = $1
		   ORDER BY clock_in DESC`,
		employeeID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.AttendanceRecord

	for rows.Next() {
		item, err := scanAttendance(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}

func (r *AttendancePostgresRepository) ListByDateRange(employeeID string, start, end string) ([]*domain.AttendanceRecord, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, employee_id, clock_in, clock_out, total_hours,
		        method, note, created_at, updated_at
		   FROM attendance_records
		   WHERE employee_id = $1
		     AND clock_in >= $2
		     AND clock_in <= $3
		   ORDER BY clock_in DESC`,
		employeeID, start, end,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.AttendanceRecord

	for rows.Next() {
		item, err := scanAttendance(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}
