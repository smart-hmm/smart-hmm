package repository

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/pgtype"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/user-setting/domain"
	usersettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/repository"
)

type UserSettingPostgresRepository struct {
	db *pgxpool.Pool
}

func NewUserSettingPostgresRepository(db *pgxpool.Pool) usersettingrepository.UserSettingRepository {
	return &UserSettingPostgresRepository{db: db}
}

func scanUserSetting(row pgx.Row) (*domain.UserSetting, error) {
	var userId string
	var key string
	var raw json.RawMessage
	var updatedAt pgtype.Timestamptz

	if err := row.Scan(&userId, &key, &raw, &updatedAt); err != nil {
		return nil, err
	}

	s, err := domain.NewUserSetting(userId, key, nil)
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

func (r *UserSettingPostgresRepository) Get(userId string, key string) (*domain.UserSetting, error) {
	row := r.db.QueryRow(context.Background(),
		`SELECT user_id, key, value, updated_at FROM user_settings WHERE user_id=$1 AND key=$2`,
		userId,
		key,
	)

	s, err := scanUserSetting(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return s, nil
}

func (r *UserSettingPostgresRepository) Save(s *domain.UserSetting) error {
	jsonValue, err := json.Marshal(s.Value)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(context.Background(),
		`INSERT INTO user_settings (user_id, key, value, updated_at)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (user_id, key)
		 DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`,
		s.UserId, s.Key, jsonValue, s.UpdatedAt,
	)

	return err
}

func (r *UserSettingPostgresRepository) Delete(userId string, key string) error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM user_settings WHERE user_id=$1 AND key=$2`,
		userId,
		key,
	)
	return err
}

func (r *UserSettingPostgresRepository) List(userId string) ([]*domain.UserSetting, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT user_id, key, value, updated_at
		 FROM user_settings
		 WHERE user_id=$1
		 ORDER BY key ASC`,
		userId,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var settings []*domain.UserSetting

	for rows.Next() {
		s, err := scanUserSetting(rows)
		if err != nil {
			return nil, err
		}
		settings = append(settings, s)
	}

	return settings, nil
}
