package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	pgvector "github.com/pgvector/pgvector-go/pgx"
	"github.com/smart-hmm/smart-hmm/internal/modules/document/domain"
	documentrepository "github.com/smart-hmm/smart-hmm/internal/modules/document/repository"
)

type DocumentPostgresRepository struct {
	pool *pgxpool.Pool
}

func NewDocumentPostgresRepository(pool *pgxpool.Pool) *DocumentPostgresRepository {
	return &DocumentPostgresRepository{pool: pool}
}

var _ documentrepository.DocumentRepository = (*DocumentPostgresRepository)(nil)

func (r *DocumentPostgresRepository) InsertDocumentWithChunks(
	ctx context.Context,
	doc *domain.Document,
	chunks []domain.Chunk,
) error {
	tx, err := r.pool.BeginTx(ctx, pgxpool.TxOptions{})
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var docID int64
	err = tx.QueryRow(ctx,
		`INSERT INTO documents (tenant_id, title, description, source, mime_type, language, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
		doc.TenantID,
		doc.Title,
		doc.Description,
		doc.Source,
		doc.MimeType,
		doc.Language,
		doc.Tags,
	).Scan(&docID)
	if err != nil {
		return err
	}

	for _, c := range chunks {
		vec := pgvector.V(c.Embedding)
		_, err = tx.Exec(ctx,
			`INSERT INTO document_chunks (document_id, tenant_id, chunk_index, content, embedding, metadata)
             VALUES ($1, $2, $3, $4, $5, $6)`,
			docID,
			doc.TenantID,
			c.ChunkIndex,
			c.Content,
			vec,
			c.Metadata,
		)
		if err != nil {
			return err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return err
	}

	return nil
}

// SearchChunks: order theo khoảng cách cosine
func (r *DocumentPostgresRepository) SearchChunks(
	ctx context.Context,
	tenantID string,
	embedding []float32,
	limit int,
) ([]domain.Chunk, error) {
	vec := pgvector.(embedding)

	rows, err := r.pool.Query(ctx,
		`SELECT c.id, c.document_id, c.tenant_id, c.chunk_index, c.content
         FROM document_chunks c
         WHERE c.tenant_id = $1
         ORDER BY c.embedding <-> $2
         LIMIT $3`,
		tenantID,
		vec,
		limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var res []domain.Chunk
	for rows.Next() {
		var c domain.Chunk
		if err := rows.Scan(&c.ID, &c.DocumentID, &c.TenantID, &c.ChunkIndex, &c.Content); err != nil {
			return nil, err
		}
		res = append(res, c)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return res, nil
}
