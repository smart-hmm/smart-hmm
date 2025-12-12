package domain

import "context"

type Embedder interface {
	Embed(ctx context.Context, text string) ([]float32, error)
}

type LLM interface {
	Generate(ctx context.Context, systemPrompt, userPrompt string) (string, error)
}
