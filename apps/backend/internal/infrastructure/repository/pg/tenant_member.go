package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"

	"github.com/jackc/pgx/v5/pgxpool"

	tenantDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant/domain"
	tenantMemberDomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/domain"
	tenantmemberrepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant_member/repository"
	txpkg "github.com/smart-hmm/smart-hmm/internal/pkg/tx"
)

type TenantMemberPostgresRepository struct {
	db *pgxpool.Pool
}

var _ tenantmemberrepository.TenantMemberRepository = (*TenantMemberPostgresRepository)(nil)

func NewTenantMemberPostgresRepository(
	db *pgxpool.Pool,
) *TenantMemberPostgresRepository {
	return &TenantMemberPostgresRepository{db: db}
}

func (r *TenantMemberPostgresRepository) exec(
	ctx context.Context,
	query string,
	args ...any,
) (pgconn.CommandTag, error) {

	if tx, ok := txpkg.TxFromContext(ctx); ok {
		return tx.Exec(ctx, query, args...)
	}
	return r.db.Exec(ctx, query, args...)
}

func (r *TenantMemberPostgresRepository) queryRow(
	ctx context.Context,
	query string,
	args ...any,
) pgx.Row {

	if tx, ok := txpkg.TxFromContext(ctx); ok {
		return tx.QueryRow(ctx, query, args...)
	}
	return r.db.QueryRow(ctx, query, args...)
}

func (r *TenantMemberPostgresRepository) query(
	ctx context.Context,
	query string,
	args ...any,
) (pgx.Rows, error) {

	if tx, ok := txpkg.TxFromContext(ctx); ok {
		return tx.Query(ctx, query, args...)
	}
	return r.db.Query(ctx, query, args...)
}

func (r *TenantMemberPostgresRepository) Save(
	ctx context.Context,
	member *tenantMemberDomain.TenantMember,
) error {

	_, err := r.exec(ctx,
		`INSERT INTO tenant_members (
			tenant_id,
			user_id,
			role,
			created_at
		)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (tenant_id, user_id)
		DO UPDATE SET
			role = EXCLUDED.role`,
		member.TenantId,
		member.UserId,
		member.Role,
		member.CreatedAt,
	)

	return err
}

func (r *TenantMemberPostgresRepository) Delete(
	ctx context.Context,
	tenantId,
	userId string,
) error {

	cmd, err := r.exec(ctx,
		`DELETE FROM tenant_members
		 WHERE tenant_id = $1 AND user_id = $2`,
		tenantId,
		userId,
	)
	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return tenantmemberrepository.ErrTenantMemberNotFound
	}

	return nil
}

func (r *TenantMemberPostgresRepository) GetByTenantAndUser(
	ctx context.Context,
	tenantId,
	userId string,
) (*tenantMemberDomain.TenantMember, error) {

	var m tenantMemberDomain.TenantMember

	err := r.queryRow(ctx,
		`SELECT
			tenant_id,
			user_id,
			role,
			created_at
		FROM tenant_members
		WHERE tenant_id = $1 AND user_id = $2`,
		tenantId,
		userId,
	).Scan(
		&m.TenantId,
		&m.UserId,
		&m.Role,
		&m.CreatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, tenantmemberrepository.ErrTenantMemberNotFound
		}
		return nil, err
	}

	return &m, nil
}

func (r *TenantMemberPostgresRepository) Exists(
	ctx context.Context,
	tenantId,
	userId string,
) (bool, error) {

	var exists bool

	err := r.queryRow(ctx,
		`SELECT EXISTS (
			SELECT 1
			FROM tenant_members
			WHERE tenant_id = $1 AND user_id = $2
		)`,
		tenantId,
		userId,
	).Scan(&exists)

	return exists, err
}

func (r *TenantMemberPostgresRepository) CountByTenantAndRole(
	ctx context.Context,
	tenantId string,
	role tenantMemberDomain.TenantRole,
) (int, error) {

	var count int

	err := r.queryRow(ctx,
		`SELECT COUNT(*)
		 FROM tenant_members
		 WHERE tenant_id = $1 AND role = $2`,
		tenantId,
		role,
	).Scan(&count)

	return count, err
}

func (r *TenantMemberPostgresRepository) ListByTenantID(
	ctx context.Context,
	tenantId string,
) ([]*tenantMemberDomain.TenantMember, error) {

	rows, err := r.query(ctx,
		`SELECT
			tenant_id,
			user_id,
			role,
			created_at
		FROM tenant_members
		WHERE tenant_id = $1
		ORDER BY created_at ASC`,
		tenantId,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []*tenantMemberDomain.TenantMember

	for rows.Next() {
		var m tenantMemberDomain.TenantMember
		if err := rows.Scan(
			&m.TenantId,
			&m.UserId,
			&m.Role,
			&m.CreatedAt,
		); err != nil {
			return nil, err
		}
		members = append(members, &m)
	}

	return members, nil
}

func (r *TenantMemberPostgresRepository) GetTenantsByUserId(
	ctx context.Context,
	userId string,
) ([]*tenantDomain.Tenant, error) {

	rows, err := r.query(ctx,
		`SELECT
			t.id,
			t.name,
			t.workspace_slug,
			t.owner_id,
			t.created_at,
			t.updated_at,
			t.deleted_at
		FROM tenants t
		JOIN tenant_members tm ON tm.tenant_id = t.id
		WHERE tm.user_id = $1
		  AND t.deleted_at IS NULL
		ORDER BY t.created_at DESC`,
		userId,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tenants []*tenantDomain.Tenant

	for rows.Next() {
		var t tenantDomain.Tenant
		if err := rows.Scan(
			&t.ID,
			&t.Name,
			&t.WorkspaceSlug,
			&t.OwnerID,
			&t.CreatedAt,
			&t.UpdatedAt,
			&t.DeletedAt,
		); err != nil {
			return nil, err
		}
		tenants = append(tenants, &t)
	}

	return tenants, nil
}
