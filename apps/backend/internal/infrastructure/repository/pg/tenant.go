package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant/repository"
)

type TenantPostgresRepository struct {
	db *pgxpool.Pool
}

var _ tenantrepository.TenantRepository = (*TenantPostgresRepository)(nil)

func NewTenantPostgresRepository(db *pgxpool.Pool) *TenantPostgresRepository {
	return &TenantPostgresRepository{db: db}
}

func (r *TenantPostgresRepository) GetByID(ctx context.Context, id string) (*domain.Tenant, error) {
	var t domain.Tenant

	err := r.db.QueryRow(ctx,
		`SELECT
			id,
			name,
			workspace_slug,
			owner_id,
			created_at,
			updated_at,
			deleted_at
		FROM tenants
		WHERE id = $1`,
		id,
	).Scan(
		&t.ID,
		&t.Name,
		&t.WorkspaceSlug,
		&t.OwnerID,
		&t.CreatedAt,
		&t.UpdatedAt,
		&t.DeletedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, tenantrepository.ErrTenantNotFound
		}
		return nil, err
	}

	return &t, nil
}

func (r *TenantPostgresRepository) Save(ctx context.Context, tenant *domain.Tenant) error {
	if tenant.ID == "" {
		err := r.db.QueryRow(ctx,
			`INSERT INTO tenants (
				name,
				workspace_slug,
				owner_id,
				created_at,
				updated_at
			)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id`,
			tenant.Name,
			tenant.WorkspaceSlug,
			tenant.OwnerID,
			tenant.CreatedAt,
			tenant.UpdatedAt,
		).Scan(&tenant.ID)

		if err != nil {
			var pgErr *pgconn.PgError
			if errors.As(err, &pgErr) && pgErr.Code == "23505" {
				return tenantrepository.ErrWorkspaceSlugAlreadyExists
			}
			return err
		}
	}

	cmd, err := r.db.Exec(ctx,
		`UPDATE tenants
		 SET
			name = $1,
			workspace_slug = $2,
			owner_id = $3,
			updated_at = $4,
			deleted_at = $5
		 WHERE id = $6`,
		tenant.Name,
		tenant.WorkspaceSlug,
		tenant.OwnerID,
		tenant.UpdatedAt,
		tenant.DeletedAt,
		tenant.ID,
	)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return tenantrepository.ErrWorkspaceSlugAlreadyExists
		}
		return err
	}

	if cmd.RowsAffected() == 0 {
		return tenantrepository.ErrTenantNotFound
	}

	return nil
}

func (r *TenantPostgresRepository) Delete(ctx context.Context, tenant *domain.Tenant) error {
	return r.Save(ctx, tenant)
}
