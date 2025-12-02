package repository

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/pgtype"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/system/domain"
	systemsettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/system/repository"
)

type SystemSettingPostgresRepository struct {
	db *pgxpool.Pool
}

func NewSystemSettingPostgresRepository(db *pgxpool.Pool) systemsettingrepository.SystemSettingRepository {
	return &SystemSettingPostgresRepository{db: db}
}

func scanSystemSetting(row pgx.Row) (*domain.SystemSetting, error) {
	var key string
	var raw json.RawMessage
	var updatedAt pgtype.Timestamptz

	if err := row.Scan(&key, &raw, &updatedAt); err != nil {
		return nil, err
	}

	s, err := domain.NewSystemSetting(key, nil)
	if err != nil {
		return nil, err
	}

	var value any
	if len(raw) > 0 {
		if err := json.Unmarshal(raw, &value); err != nil {
			return nil, err
		}
	}
	s.Value = value

	if updatedAt.Status == pgtype.Present {
		s.UpdatedAt = updatedAt.Time
	}

	return s, nil
}

func (r *SystemSettingPostgresRepository) Get(key string) (*domain.SystemSetting, error) {
	row := r.db.QueryRow(context.Background(),
		`SELECT key, value, updated_at FROM system_settings WHERE key=$1`,
		key,
	)

	s, err := scanSystemSetting(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return s, nil
}

func (r *SystemSettingPostgresRepository) Save(s *domain.SystemSetting) error {
	jsonValue, err := json.Marshal(s.Value)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(context.Background(),
		`INSERT INTO system_settings (key, value, updated_at)
		 VALUES ($1, $2, $3)
		 ON CONFLICT (key)
		 DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`,
		s.Key, jsonValue, s.UpdatedAt,
	)

	return err
}

func (r *SystemSettingPostgresRepository) Delete(key string) error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM system_settings WHERE key=$1`,
		key,
	)
	return err
}

func (r *SystemSettingPostgresRepository) List() ([]*domain.SystemSetting, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT key, value, updated_at
		 FROM system_settings
		 ORDER BY key ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var settings []*domain.SystemSetting

	for rows.Next() {
		s, err := scanSystemSetting(rows)
		if err != nil {
			return nil, err
		}
		settings = append(settings, s)
	}

	return settings, nil
}
