package documentusecase

import (
	"context"
	"fmt"

	docdto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/document/dto"
	aidomain "github.com/smart-hmm/smart-hmm/internal/modules/ai/domain"
	docdomain "github.com/smart-hmm/smart-hmm/internal/modules/document/domain"
	documentrepository "github.com/smart-hmm/smart-hmm/internal/modules/document/repository"
)

type IngestFileUsecase struct {
	Downloader FileDownloader
	Extractor  TextExtractor
	Chunker    Chunker
	Embedder   aidomain.Embedder
	Repo       documentrepository.DocumentRepository
}

func NewIngestFileUsecase(
	downloader FileDownloader,
	extractor TextExtractor,
	chunker Chunker,
	embedder aidomain.Embedder,
	repo documentrepository.DocumentRepository,
) *IngestFileUsecase {
	return &IngestFileUsecase{
		Downloader: downloader,
		Extractor:  extractor,
		Chunker:    chunker,
		Embedder:   embedder,
		Repo:       repo,
	}
}

func (uc *IngestFileUsecase) Execute(ctx context.Context, input docdto.IngestFileRequest) error {
	raw, err := uc.Downloader.Download(ctx, input.S3Key)
	if err != nil {
		return fmt.Errorf("failed to download from s3: %w", err)
	}

	fullText, err := uc.Extractor.Extract(ctx, input.MimeType, raw)
	if err != nil {
		return fmt.Errorf("failed to extract text: %w", err)
	}

	chunksText := uc.Chunker.Chunk(fullText)
	if len(chunksText) == 0 {
		return fmt.Errorf("document contains no extractable text")
	}

	var chunks []docdomain.Chunk
	for i, content := range chunksText {
		embedding, err := uc.Embedder.Embed(ctx, content)
		if err != nil {
			return fmt.Errorf("embedding failed: %w", err)
		}

		chunks = append(chunks, docdomain.Chunk{
			ChunkIndex: i,
			Content:    content,
			Embedding:  embedding,
			Metadata:   map[string]any{},
		})
	}

	doc := &docdomain.Document{
		Title:       input.Title,
		Description: "",
		Source:      input.S3Key,
		MimeType:    input.MimeType,
		Language:    input.Language,
		Tags:        input.Tags,
	}

	if err := uc.Repo.InsertDocumentWithChunks(ctx, doc, chunks); err != nil {
		return fmt.Errorf("failed saving document: %w", err)
	}

	return nil
}
