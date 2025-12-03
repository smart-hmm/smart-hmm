package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/user/domain"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
)

type UserPostgresRepository struct {
	db *pgxpool.Pool
}

func NewUserPostgresRepository(db *pgxpool.Pool) userrepository.UserRepository {
	return &UserPostgresRepository{db: db}
}

func (r *UserPostgresRepository) Create(u *domain.User) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO users 
		 (email, password_hash, role, employee_id)
		 VALUES ($1, $2, $3, $4)`,
		u.Email, u.PasswordHash, u.Role, *u.EmployeeID,
	)
	return err
}

func (r *UserPostgresRepository) Update(u *domain.User) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE users 
		 SET email=$1,
		     password_hash=$2,
		     role=$3,
		     employee_id=$4,
		     updated_at = NOW()
		 WHERE id = $5`,
		u.Email,
		u.PasswordHash,
		u.Role,
		u.EmployeeID,
		u.ID,
	)
	return err
}

func scanUser(row pgx.Row) (*domain.User, error) {
	var u domain.User
	var employeeID *string

	err := row.Scan(
		&u.ID,
		&u.Email,
		&u.PasswordHash,
		&u.Role,
		&employeeID,
		&u.CreatedAt,
		&u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	u.EmployeeID = employeeID
	return &u, nil
}

func (r *UserPostgresRepository) FindByID(id string) (*domain.User, error) {
	return scanUser(
		r.db.QueryRow(context.Background(),
			`SELECT id, email, password_hash, role, employee_id, created_at, updated_at
			 FROM users WHERE id = $1`,
			id,
		),
	)
}

func (r *UserPostgresRepository) FindByEmail(email string) (*domain.User, error) {
	return scanUser(
		r.db.QueryRow(context.Background(),
			`SELECT id, email, password_hash, role, employee_id, created_at, updated_at
			 FROM users WHERE email = $1`,
			email,
		),
	)
}

func (r *UserPostgresRepository) ListAll() ([]*domain.User, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, email, password_hash, role, employee_id, created_at, updated_at
		 FROM users ORDER BY email ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.User

	for rows.Next() {
		item, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}
