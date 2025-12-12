package aidto

import "github.com/smart-hmm/smart-hmm/internal/modules/document/domain"

type AskRequest struct {
	Question   string `json:"question" validate:"required"`
	MaxChunks  int    `json:"maxChunks"`
	SystemHint string `json:"systemHint"`
}

type AskResponse struct {
	Answer map[string]any `json:"answer"`
	Chunks []domain.Chunk `json:"chunks"`
}
