package repository

import (
	"context"
	"encoding/json"

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

// Set() inserts or updates a setting
func (r *SystemSettingPostgresRepository) Set(key string, value any) error {
	jsonValue, err := json.Marshal(value)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(context.Background(),
		`INSERT INTO system_settings (key, value, updated_at)
		 VALUES ($1, $2, NOW())
		 ON CONFLICT (key) DO UPDATE
		    SET value = EXCLUDED.value,
		        updated_at = NOW()`,
		key, jsonValue,
	)
	return err
}

func scanSystemSetting(row pgx.Row) (*domain.SystemSetting, error) {
	var s domain.SystemSetting
	err := row.Scan(
		&s.Key,
		&s.Value,
		&s.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *SystemSettingPostgresRepository) Get(key string) (*domain.SystemSetting, error) {
	return scanSystemSetting(
		r.db.QueryRow(context.Background(),
			`SELECT key, value, updated_at
			 FROM system_settings
			 WHERE key=$1`,
			key,
		),
	)
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
		item, err := scanSystemSetting(rows)
		if err != nil {
			return nil, err
		}
		settings = append(settings, item)
	}

	return settings, nil
}
