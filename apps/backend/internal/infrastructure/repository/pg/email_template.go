package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/pgtype"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	emailtemplatedomain "github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type EmailTemplatePostgresRepository struct {
	db *pgxpool.Pool
}

func NewEmailTemplatePostgresRepository(db *pgxpool.Pool) emailtemplaterepository.EmailTemplateRepository {
	return &EmailTemplatePostgresRepository{db: db}
}

func (r *EmailTemplatePostgresRepository) Create(t *emailtemplatedomain.EmailTemplate) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO email_templates (id, name, subject, body, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		t.ID, t.Name, t.Subject, t.Body, t.CreatedAt, t.UpdatedAt,
	)
	return err
}

func (r *EmailTemplatePostgresRepository) Update(t *emailtemplatedomain.EmailTemplate) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE email_templates
		    SET name=$1, subject=$2, body=$3, updated_at=$4
		  WHERE id=$5`, t.Name, t.Subject, t.Body, t.UpdatedAt, t.ID)
	return err
}

func (r *EmailTemplatePostgresRepository) SoftDelete(id string) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE email_templates
		    SET deleted_at = NOW()
		  WHERE id=$1`, id)
	return err
}

func scanEmailTemplate(row pgx.Row) (*emailtemplatedomain.EmailTemplate, error) {
	var t emailtemplatedomain.EmailTemplate
	var deletedAt pgtype.Timestamptz
	err := row.Scan(&t.ID, &t.Name, &t.Subject, &t.Body, &t.CreatedAt, &t.UpdatedAt, &deletedAt)
	if err != nil {
		return nil, err
	}

	if deletedAt.Status == pgtype.Present {
		ts := deletedAt.Time
		t.DeletedAt = &ts
	}

	return &t, nil
}

func (r *EmailTemplatePostgresRepository) FindByID(id string) (*emailtemplatedomain.EmailTemplate, error) {
	row := r.db.QueryRow(context.Background(),
		`SELECT id, name, subject, body, created_at, updated_at, deleted_at
		   FROM email_templates
		  WHERE id=$1 AND deleted_at IS NULL`, id)

	t, err := scanEmailTemplate(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return t, nil
}

func (r *EmailTemplatePostgresRepository) FindByName(name string) (*emailtemplatedomain.EmailTemplate, error) {
	row := r.db.QueryRow(context.Background(),
		`SELECT id, name, subject, body, created_at, updated_at, deleted_at
		   FROM email_templates
		  WHERE name=$1 AND deleted_at IS NULL`, name)

	t, err := scanEmailTemplate(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return t, nil
}

func (r *EmailTemplatePostgresRepository) ListAll() ([]*emailtemplatedomain.EmailTemplate, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, name, subject, body, created_at, updated_at, deleted_at
		   FROM email_templates
		  WHERE deleted_at IS NULL
		  ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var templates []*emailtemplatedomain.EmailTemplate
	for rows.Next() {
		t, err := scanEmailTemplate(rows)
		if err != nil {
			return nil, err
		}
		templates = append(templates, t)
	}

	return templates, nil
}
