package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	tenantprofiledomain "github.com/smart-hmm/smart-hmm/internal/modules/tenant_profile/domain"
	tenantprofilerepository "github.com/smart-hmm/smart-hmm/internal/modules/tenant_profile/repository"
)

type TenantProfilePostgresRepository struct {
	db *pgxpool.Pool
}

var _ tenantprofilerepository.TenantProfileRepository = (*TenantProfilePostgresRepository)(nil)

func NewTenantProfilePostgresRepository(
	db *pgxpool.Pool,
) *TenantProfilePostgresRepository {
	return &TenantProfilePostgresRepository{db: db}
}

func (r *TenantProfilePostgresRepository) Create(
	ctx context.Context,
	profile *tenantprofiledomain.TenantProfile,
) error {

	err := r.db.QueryRow(ctx,
		`INSERT INTO tenant_profiles (
			tenant_id,
			legal_name,
			logo_url,
			industry,
			company_size,
			country,
			timezone,
			currency,
			created_at,
			updated_at
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
		RETURNING id`,
		profile.TenantID,
		profile.LegalName,
		profile.LogoURL,
		profile.Industry,
		profile.CompanySize,
		profile.Country,
		profile.Timezone,
		profile.Currency,
		profile.CreatedAt,
		profile.UpdatedAt,
	).Scan(&profile.ID)

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			// unique constraint on tenant_id
			return tenantprofilerepository.ErrTenantProfileAlreadyExists
		}
		return err
	}

	return nil
}

func (r *TenantProfilePostgresRepository) GetByTenantID(
	ctx context.Context,
	tenantID string,
) (*tenantprofiledomain.TenantProfile, error) {

	var p tenantprofiledomain.TenantProfile

	err := r.db.QueryRow(ctx,
		`SELECT
			id,
			tenant_id,
			legal_name,
			logo_url,
			industry,
			company_size,
			country,
			timezone,
			currency,
			created_at,
			updated_at
		FROM tenant_profiles
		WHERE tenant_id = $1`,
		tenantID,
	).Scan(
		&p.ID,
		&p.TenantID,
		&p.LegalName,
		&p.LogoURL,
		&p.Industry,
		&p.CompanySize,
		&p.Country,
		&p.Timezone,
		&p.Currency,
		&p.CreatedAt,
		&p.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, tenantprofilerepository.ErrTenantProfileNotFound
		}
		return nil, err
	}

	return &p, nil
}

func (r *TenantProfilePostgresRepository) Update(
	ctx context.Context,
	profile *tenantprofiledomain.TenantProfile,
) error {

	cmd, err := r.db.Exec(ctx,
		`UPDATE tenant_profiles
		 SET
			legal_name = $1,
			logo_url = $2,
			industry = $3,
			company_size = $4,
			country = $5,
			timezone = $6,
			currency = $7,
			updated_at = $8
		 WHERE tenant_id = $9`,
		profile.LegalName,
		profile.LogoURL,
		profile.Industry,
		profile.CompanySize,
		profile.Country,
		profile.Timezone,
		profile.Currency,
		profile.UpdatedAt,
		profile.TenantID,
	)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return tenantprofilerepository.ErrTenantProfileNotFound
	}

	return nil
}

func (r *TenantProfilePostgresRepository) ExistsByTenantID(
	ctx context.Context,
	tenantID string,
) (bool, error) {

	var exists bool

	err := r.db.QueryRow(ctx,
		`SELECT EXISTS (
			SELECT 1
			FROM tenant_profiles
			WHERE tenant_id = $1
		)`,
		tenantID,
	).Scan(&exists)

	if err != nil {
		return false, err
	}

	return exists, nil
}
