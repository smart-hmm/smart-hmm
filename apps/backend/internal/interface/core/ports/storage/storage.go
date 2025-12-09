package storageports

import (
	"context"
	"io"
	"time"
)

type FileMetadata struct {
	Name        string
	Size        int64
	ContentType string
	URL         string
	Checksum    string
}

type UploadInput struct {
	Path        string
	Filename    string
	Reader      io.Reader
	Size        int64
	ContentType string
}

type PresignInput struct {
	Path        string
	ContentType string
	ExpiresIn   time.Duration
	Method      string
}

type StorageService interface {
	Upload(ctx context.Context, in UploadInput) (*FileMetadata, error)
	Download(ctx context.Context, path string) (io.ReadCloser, error)

	Delete(ctx context.Context, path string) error
	Exists(ctx context.Context, path string) (bool, error)

	GetPublicURL(ctx context.Context, path string) (string, error)
	PresignURL(ctx context.Context, in PresignInput) (string, error)
}
