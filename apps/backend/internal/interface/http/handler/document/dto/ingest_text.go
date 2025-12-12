package documentdto

type IngestTextRequest struct {
	Title       string   `json:"title" validate:"required"`
	Description string   `json:"description"`
	Source      string   `json:"source" validate:"required"`
	MimeType    string   `json:"mimeType" validate:"required"`
	Language    string   `json:"language" validate:"required"`
	Tags        []string `json:"tags"`
	Content     string   `json:"content" validate:"required"`
}
