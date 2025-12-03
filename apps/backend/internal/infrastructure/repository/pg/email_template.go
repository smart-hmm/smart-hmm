package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	domain "github.com/smart-hmm/smart-hmm/internal/modules/email_template/domain"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
)

type EmailTemplatePostgresRepository struct {
	db *pgxpool.Pool
}

var _ emailtemplaterepository.EmailTemplateRepository = (*EmailTemplatePostgresRepository)(nil)

func NewEmailTemplatePostgresRepository(db *pgxpool.Pool) *EmailTemplatePostgresRepository {
	return &EmailTemplatePostgresRepository{db: db}
}

func (r *EmailTemplatePostgresRepository) CreateTemplate(t *domain.Template) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO templates (id, key, name, description, created_at, updated_at)
		 VALUES ($1,$2,$3,$4,$5,$6)`,
		t.ID, t.Key, t.Name, t.Description, t.CreatedAt, t.UpdatedAt,
	)
	return err
}

func (r *EmailTemplatePostgresRepository) UpdateTemplate(t *domain.Template) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE templates
		    SET key=$1, name=$2, description=$3, updated_at=$4
		  WHERE id=$5`,
		t.Key, t.Name, t.Description, t.UpdatedAt, t.ID,
	)
	return err
}

func scanTemplate(row pgx.Row) (*domain.Template, error) {
	var t domain.Template

	err := row.Scan(
		&t.ID,
		&t.Key,
		&t.Name,
		&t.Description,
		&t.CreatedAt,
		&t.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &t, nil
}

func (r *EmailTemplatePostgresRepository) FindTemplateByID(id string) (*domain.Template, error) {
	row := r.db.QueryRow(context.Background(),
		`SELECT id, key, name, description, created_at, updated_at
		   FROM templates
		  WHERE id=$1`,
		id,
	)

	t, err := scanTemplate(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return t, nil
}

func (r *EmailTemplatePostgresRepository) FindTemplateByKey(key string) (*domain.Template, error) {
	row := r.db.QueryRow(context.Background(),
		`SELECT id, key, name, description, created_at, updated_at
		   FROM templates
		  WHERE key=$1`,
		key,
	)

	t, err := scanTemplate(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return t, nil
}

func (r *EmailTemplatePostgresRepository) ListTemplates() ([]*domain.Template, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, key, name, description, created_at, updated_at
		   FROM templates
		  ORDER BY created_at DESC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var templates []*domain.Template

	for rows.Next() {
		t, err := scanTemplate(rows)
		if err != nil {
			return nil, err
		}
		templates = append(templates, t)
	}

	return templates, nil
}

func (r *EmailTemplatePostgresRepository) SoftDeleteTemplate(id string) error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM templates WHERE id=$1`, id,
	)
	return err
}

//
// ======================================================
// TEMPLATE VERSIONS
// ======================================================
//

func (r *EmailTemplatePostgresRepository) CreateVersion(v *domain.TemplateVersion) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO template_versions
		  (id, template_id, version, locale, channel, subject, body_html, body_text, status, created_by, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
		v.ID,
		v.TemplateID,
		v.Version,
		v.Locale,
		v.Channel,
		v.Subject,
		v.BodyHTML,
		v.BodyText,
		v.Status,
		v.CreatedBy,
		v.CreatedAt,
	)
	return err
}

func (r *EmailTemplatePostgresRepository) UpdateVersion(v *domain.TemplateVersion) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE template_versions
		    SET subject=$1, body_html=$2, body_text=$3, status=$4
		  WHERE id=$5`,
		v.Subject,
		v.BodyHTML,
		v.BodyText,
		v.Status,
		v.ID,
	)
	return err
}

func scanTemplateVersion(row pgx.Row) (*domain.TemplateVersion, error) {
	var v domain.TemplateVersion

	err := row.Scan(
		&v.ID,
		&v.TemplateID,
		&v.Version,
		&v.Locale,
		&v.Channel,
		&v.Subject,
		&v.BodyHTML,
		&v.BodyText,
		&v.Status,
		&v.CreatedBy,
		&v.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &v, nil
}

func (r *EmailTemplatePostgresRepository) FindVersionByID(id string) (*domain.TemplateVersion, error) {
	row := r.db.QueryRow(context.Background(),
		`SELECT id, template_id, version, locale, channel,
		        subject, body_html, body_text, status, created_by, created_at
		   FROM template_versions
		  WHERE id=$1`,
		id,
	)

	v, err := scanTemplateVersion(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return v, nil
}

func (r *EmailTemplatePostgresRepository) FindActiveVersion(
	templateKey string,
	locale string,
	channel domain.TemplateChannel,
) (*domain.TemplateVersion, error) {

	row := r.db.QueryRow(context.Background(),
		`SELECT tv.id, tv.template_id, tv.version, tv.locale, tv.channel,
		        tv.subject, tv.body_html, tv.body_text, tv.status, tv.created_by, tv.created_at
		   FROM template_versions tv
		   JOIN templates t ON t.id = tv.template_id
		  WHERE t.key=$1
		    AND tv.locale=$2
		    AND tv.channel=$3
		    AND tv.status='active'
		  LIMIT 1`,
		templateKey,
		locale,
		channel,
	)

	v, err := scanTemplateVersion(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return v, nil
}

func (r *EmailTemplatePostgresRepository) ListVersionsByTemplateID(templateID string) ([]*domain.TemplateVersion, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, template_id, version, locale, channel,
		        subject, body_html, body_text, status, created_by, created_at
		   FROM template_versions
		  WHERE template_id=$1
		  ORDER BY version DESC`,
		templateID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var versions []*domain.TemplateVersion

	for rows.Next() {
		v, err := scanTemplateVersion(rows)
		if err != nil {
			return nil, err
		}
		versions = append(versions, v)
	}

	return versions, nil
}

func (r *EmailTemplatePostgresRepository) SetActiveVersion(versionID string) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE template_versions
		    SET status='active'
		  WHERE id=$1`,
		versionID,
	)
	return err
}

func (r *EmailTemplatePostgresRepository) ArchiveVersion(versionID string) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE template_versions
		    SET status='archived'
		  WHERE id=$1`,
		versionID,
	)
	return err
}

func (r *EmailTemplatePostgresRepository) SoftDeleteVersion(id string) error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM template_versions WHERE id=$1`, id)
	return err
}

//
// ======================================================
// TEMPLATE VARIABLES
// ======================================================
//

func (r *EmailTemplatePostgresRepository) CreateVariable(v *domain.TemplateVariable) error {
	_, err := r.db.Exec(context.Background(),
		`INSERT INTO template_variables
		  (id, template_id, key, description, required, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6)`,
		v.ID,
		v.TemplateID,
		v.Key,
		v.Desc,
		v.Required,
		v.CreatedAt,
	)
	return err
}

func (r *EmailTemplatePostgresRepository) UpdateVariable(v *domain.TemplateVariable) error {
	_, err := r.db.Exec(context.Background(),
		`UPDATE template_variables
		    SET key=$1, description=$2, required=$3
		  WHERE id=$4`,
		v.Key, v.Desc, v.Required, v.ID,
	)
	return err
}

func scanTemplateVariable(row pgx.Row) (*domain.TemplateVariable, error) {
	var v domain.TemplateVariable

	err := row.Scan(
		&v.ID,
		&v.TemplateID,
		&v.Key,
		&v.Desc,
		&v.Required,
		&v.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &v, nil
}

func (r *EmailTemplatePostgresRepository) FindVariableByID(id string) (*domain.TemplateVariable, error) {
	row := r.db.QueryRow(context.Background(),
		`SELECT id, template_id, key, description, required, created_at
		   FROM template_variables
		  WHERE id=$1`, id,
	)

	v, err := scanTemplateVariable(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return v, nil
}

func (r *EmailTemplatePostgresRepository) FindVariablesByTemplateID(templateID string) ([]*domain.TemplateVariable, error) {
	rows, err := r.db.Query(context.Background(),
		`SELECT id, template_id, key, description, required, created_at
		   FROM template_variables
		  WHERE template_id=$1
		  ORDER BY created_at ASC`,
		templateID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var variables []*domain.TemplateVariable

	for rows.Next() {
		v, err := scanTemplateVariable(rows)
		if err != nil {
			return nil, err
		}
		variables = append(variables, v)
	}

	return variables, nil
}

func (r *EmailTemplatePostgresRepository) DeleteVariable(id string) error {
	_, err := r.db.Exec(context.Background(),
		`DELETE FROM template_variables WHERE id=$1`, id,
	)
	return err
}
