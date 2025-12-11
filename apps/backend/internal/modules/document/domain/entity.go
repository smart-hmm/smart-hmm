package domain

import "context"

type Document struct {
	ID          int64
	TenantID    string
	Title       string
	Description string
	Source      string
	MimeType    string
	Language    string
	Tags        []string
}

type Chunk struct {
	ID         int64
	DocumentID int64
	TenantID   string
	ChunkIndex int
	Content    string
	Embedding  []float32
	Metadata   map[string]any
}

type Embedder interface {
	Embed(ctx context.Context, text string) ([]float32, error)
}

type LLMClient interface {
	Generate(ctx context.Context, systemPrompt, userPrompt string) (string, error)
}
