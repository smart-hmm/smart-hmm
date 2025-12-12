package documentrepository

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/document/domain"
)

type DocumentRepository interface {
	InsertDocumentWithChunks(ctx context.Context, doc *domain.Document, chunks []domain.Chunk) error
	SearchChunks(ctx context.Context, embedding []float32, limit int) ([]domain.Chunk, error)
}
