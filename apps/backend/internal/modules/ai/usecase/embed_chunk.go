package aiusecase

import (
	"context"

	"github.com/smart-hmm/smart-hmm/internal/modules/ai/domain"
)

type EmbedChunkUseCase struct {
	embedder domain.Embedder
}

func NewEmbedChunkUseCase(embedder domain.Embedder) *EmbedChunkUseCase {
	return &EmbedChunkUseCase{embedder: embedder}
}

func (uc *EmbedChunkUseCase) Execute(ctx context.Context, text string) ([]float32, error) {
	return uc.embedder.Embed(ctx, text)
}
