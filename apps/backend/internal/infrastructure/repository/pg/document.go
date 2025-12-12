package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	pgvector "github.com/pgvector/pgvector-go"
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

	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	var docID int64
	err = tx.QueryRow(ctx,
		`INSERT INTO documents (title, description, source, mime_type, language, tags)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,

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
		vec := pgvector.NewVector(c.Embedding)

		_, err = tx.Exec(ctx,
			`INSERT INTO document_chunks (document_id, chunk_index, content, embedding, metadata)
             VALUES ($1, $2, $3, $4, $5)`,
			docID,
			c.ChunkIndex,
			c.Content,
			vec,
			c.Metadata,
		)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

func (r *DocumentPostgresRepository) SearchChunks(
	ctx context.Context,
	embedding []float32,
	limit int,
	maxDistance float64,
) ([]domain.Chunk, error) {

	vec := pgvector.NewVector(embedding)

	rows, err := r.pool.Query(ctx, `
		SELECT
			id,
			document_id,
			chunk_index,
			content,
			embedding <-> $1 AS distance
		FROM document_chunks
		ORDER BY distance ASC
		LIMIT $2
	`,
		vec,
		1000,
	)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []domain.Chunk

	for rows.Next() {
		var c domain.Chunk
		var distance float64

		if err := rows.Scan(
			&c.ID,
			&c.DocumentID,
			&c.ChunkIndex,
			&c.Content,
			&distance,
		); err != nil {
			return nil, err
		}

		if distance <= maxDistance {
			c.Distance = &distance
			results = append(results, c)
		}

		if len(results) >= limit {
			break
		}
	}

	return results, nil
}
