package domain

type Document struct {
	ID          int64
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
	ChunkIndex int
	Content    string
	Embedding  []float32
	Metadata   map[string]any

	Distance *float64
}
