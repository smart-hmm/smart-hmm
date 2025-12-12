package documentdto

type IngestFileRequest struct {
	S3Key    string   `json:"s3Key" validate:"required"`
	Title    string   `json:"title" validate:"required"`
	MimeType string   `json:"mimeType" validate:"required"`
	Language string   `json:"language"`
	Tags     []string `json:"tags"`
}
