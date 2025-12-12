package documentusecase

import "unicode"

type ChunkTextUseCase struct{}

func NewChunkTextUseCase() *ChunkTextUseCase {
	return &ChunkTextUseCase{}
}

func (uc *ChunkTextUseCase) Execute(text string, maxLen int) []string {
	var chunks []string
	runes := []rune(text)

	for len(runes) > 0 {
		if len(runes) <= maxLen {
			chunks = append(chunks, string(runes))
			break
		}

		cut := maxLen
		for cut > maxLen-200 && cut < len(runes) && !unicode.IsSpace(runes[cut]) {
			cut--
		}
		if cut <= 0 {
			cut = maxLen
		}

		chunks = append(chunks, string(runes[:cut]))
		runes = runes[cut:]
	}

	return chunks
}
