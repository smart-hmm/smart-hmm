package documentusecase

import (
	"context"
	"fmt"

	aiusecase "github.com/smart-hmm/smart-hmm/internal/modules/ai/usecase"
	docdomain "github.com/smart-hmm/smart-hmm/internal/modules/document/domain"
	documentrepository "github.com/smart-hmm/smart-hmm/internal/modules/document/repository"
)

type IngestDocumentUseCase struct {
	docRepo documentrepository.DocumentRepository
	chunker *ChunkTextUseCase
	embedUC *aiusecase.EmbedChunkUseCase
}

type IngestDocumentInput struct {
	Title       string
	Description string
	Source      string
	MimeType    string
	Language    string
	Tags        []string
	Content     string
}

func NewIngestDocumentUseCase(
	docRepo documentrepository.DocumentRepository,
	chunker *ChunkTextUseCase,
	embedUC *aiusecase.EmbedChunkUseCase,
) *IngestDocumentUseCase {
	return &IngestDocumentUseCase{docRepo, chunker, embedUC}
}

func (uc *IngestDocumentUseCase) Execute(ctx context.Context, input IngestDocumentInput) error {

	chunksText := uc.chunker.Execute(input.Content, 1500)
	if len(chunksText) == 0 {
		return fmt.Errorf("no text to ingest")
	}

	var chunks []docdomain.Chunk

	for i, text := range chunksText {
		emb, err := uc.embedUC.Execute(ctx, text)
		if err != nil {
			return fmt.Errorf("embed error: %w", err)
		}

		chunks = append(chunks, docdomain.Chunk{
			ChunkIndex: i,
			Content:    text,
			Embedding:  emb,
			Metadata:   map[string]any{},
		})
	}

	doc := &docdomain.Document{
		Title:       input.Title,
		Description: input.Description,
		Source:      input.Source,
		MimeType:    input.MimeType,
		Language:    input.Language,
		Tags:        input.Tags,
	}

	return uc.docRepo.InsertDocumentWithChunks(ctx, doc, chunks)
}
