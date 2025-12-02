package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/config"
)

type PostgresDatabase struct {
	DSN  string
	pool *pgxpool.Pool
}

func NewPostgresDatabase(cfg *config.Config) *PostgresDatabase {
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable",
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.Name,
	)
	return &PostgresDatabase{
		DSN: dsn,
	}
}

func (db *PostgresDatabase) Open(ctx context.Context) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(db.DSN)
	if err != nil {
		return nil, fmt.Errorf("failed to parse dsn: %w", err)
	}

	// Optional: pool tuning
	cfg.MaxConns = 10
	cfg.MinConns = 1
	cfg.MaxConnLifetime = time.Hour

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to connect: %w", err)
	}

	db.pool = pool
	return pool, nil
}

func (db *PostgresDatabase) Close() {
	if db.pool != nil {
		db.pool.Close()
	}
}

func (db *PostgresDatabase) Ping(ctx context.Context) error {
	if db.pool == nil {
		return fmt.Errorf("database not opened")
	}

	return db.pool.Ping(ctx)
}

func buildDSN() {

}
