package repository

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/domain"
	refreshtokenrepository "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/repository"
)

type RefreshTokenPostgresRepository struct {
	db *pgxpool.Pool
}

func NewRefreshTokenPostgresRepository(
	db *pgxpool.Pool,
) refreshtokenrepository.RefreshTokenRepository {
	return &RefreshTokenPostgresRepository{db: db}
}

func (r *RefreshTokenPostgresRepository) Create(t *domain.RefreshToken) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO refresh_tokens (
			user_id,
			token_hash,
			user_agent,
			ip_address,
			expires_at,
			revoked_at,
			created_at
		) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
		t.UserID,
		t.TokenHash,
		t.UserAgent,
		t.IPAddress,
		t.ExpiresAt,
		t.RevokedAt,
		t.CreatedAt,
	)
	return err
}

func (r *RefreshTokenPostgresRepository) DeleteByID(id string) error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM refresh_tokens WHERE id = $1`,
		id,
	)
	return err
}

func (r *RefreshTokenPostgresRepository) DeleteByTokenHash(tokenHash string) error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM refresh_tokens WHERE token_hash = $1`,
		tokenHash,
	)
	return err
}

func (r *RefreshTokenPostgresRepository) DeleteByUserID(userID string) error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM refresh_tokens WHERE user_id = $1`,
		userID,
	)
	return err
}

func (r *RefreshTokenPostgresRepository) RevokeByTokenHash(tokenHash string) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE refresh_tokens
		 SET revoked_at = NOW()
		 WHERE token_hash = $1`,
		tokenHash,
	)
	return err
}

func (r *RefreshTokenPostgresRepository) FindByTokenHash(
	tokenHash string,
) (*domain.RefreshToken, error) {

	return scanRefreshToken(
		r.db.QueryRow(context.Background(),
			`SELECT
				id,
				user_id,
				token_hash,
				user_agent,
				ip_address,
				expires_at,
				revoked_at,
				created_at
			 FROM refresh_tokens
			 WHERE token_hash = $1`,
			tokenHash,
		),
	)
}

func (r *RefreshTokenPostgresRepository) ListActiveByUserID(
	userID string,
) ([]*domain.RefreshToken, error) {

	rows, err := r.db.Query(context.Background(),
		`SELECT
			id,
			user_id,
			token_hash,
			user_agent,
			ip_address,
			expires_at,
			revoked_at,
			created_at
		 FROM refresh_tokens
		 WHERE user_id = $1
		   AND revoked_at IS NULL
		   AND expires_at > NOW()
		 ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*domain.RefreshToken

	for rows.Next() {
		item, err := scanRefreshToken(rows)
		if err != nil {
			return nil, err
		}
		results = append(results, item)
	}

	return results, nil
}

func (r *RefreshTokenPostgresRepository) DeleteExpired() error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM refresh_tokens WHERE expires_at < NOW()`,
	)
	return err
}

func scanRefreshToken(row pgx.Row) (*domain.RefreshToken, error) {
	var t domain.RefreshToken

	err := row.Scan(
		&t.ID,
		&t.UserID,
		&t.TokenHash,
		&t.UserAgent,
		&t.IPAddress,
		&t.ExpiresAt,
		&t.RevokedAt,
		&t.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &t, nil
}
