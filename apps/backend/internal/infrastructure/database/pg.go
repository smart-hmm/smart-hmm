package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	pgxvector "github.com/pgvector/pgvector-go/pgx"

	"github.com/smart-hmm/smart-hmm/internal/config"
	databaseport "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/database"
)

type PostgresDatabase struct {
	DSN  string
	pool *pgxpool.Pool
}

var _ databaseport.Database = (*PostgresDatabase)(nil)

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

func (db *PostgresDatabase) Open(ctx context.Context) error {
	cfg, err := pgxpool.ParseConfig(db.DSN)
	if err != nil {
		return fmt.Errorf("failed to parse dsn: %w", err)
	}

	cfg.MaxConns = 10
	cfg.MinConns = 1
	cfg.MaxConnLifetime = time.Hour

	cfg.AfterConnect = func(ctx context.Context, conn *pgx.Conn) error {
		return pgxvector.RegisterTypes(ctx, conn)
	}

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return fmt.Errorf("failed to connect: %w", err)
	}

	db.pool = pool
	return nil
}

func (db *PostgresDatabase) Close(ctx context.Context) error {
	if db.pool != nil {
		db.pool.Close()
	}
	return nil
}

func (db *PostgresDatabase) Ping(ctx context.Context) error {
	if db.pool == nil {
		return fmt.Errorf("database not opened")
	}
	return db.pool.Ping(ctx)
}

func (db *PostgresDatabase) Pool() *pgxpool.Pool {
	return db.pool
}
