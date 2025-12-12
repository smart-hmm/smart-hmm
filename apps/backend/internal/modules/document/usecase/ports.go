package documentusecase

import "context"

type FileDownloader interface {
	Download(ctx context.Context, s3Key string) ([]byte, error)
}

type TextExtractor interface {
	Extract(ctx context.Context, mimeType string, data []byte) (string, error)
}

type Chunker interface {
	Chunk(text string) []string
}

type Embedder interface {
	Embed(ctx context.Context, text string) ([]float32, error)
}
