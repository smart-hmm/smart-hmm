package s3storage

import (
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	storageports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/storage"
)

type S3Storage struct {
	client    *s3.Client
	uploader  *manager.Uploader
	presigner *s3.PresignClient
	bucket    string
	publicURL string
}

var _ storageports.StorageService = (*S3Storage)(nil)

func NewS3Storage(client *s3.Client, bucket, publicURL string) *S3Storage {
	return &S3Storage{
		client:    client,
		uploader:  manager.NewUploader(client),
		presigner: s3.NewPresignClient(client),
		bucket:    bucket,
		publicURL: strings.TrimRight(publicURL, "/"),
	}
}

func NewS3Client(ctx context.Context, region string) (*s3.Client, error) {
	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion(region),
	)
	if err != nil {
		return nil, err
	}

	return s3.NewFromConfig(cfg), nil
}

func (s *S3Storage) Upload(ctx context.Context, in storageports.UploadInput) (*storageports.FileMetadata, error) {
	key := fmt.Sprintf("%s/%s", strings.TrimRight(in.Path, "/"), in.Filename)

	out, err := s.uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		Body:        in.Reader,
		ContentType: aws.String(in.ContentType),
		ACL:         types.ObjectCannedACLPublicRead,
	})
	if err != nil {
		return nil, err
	}

	return &storageports.FileMetadata{
		Name:        in.Filename,
		Size:        in.Size,
		ContentType: in.ContentType,
		URL:         out.Location,
	}, nil
}

func (s *S3Storage) Download(ctx context.Context, path string) (io.ReadCloser, error) {
	resp, err := s.client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(path),
	})
	if err != nil {
		return nil, err
	}

	return resp.Body, nil
}

func (s *S3Storage) Delete(ctx context.Context, path string) error {
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(path),
	})
	return err
}

func (s *S3Storage) Exists(ctx context.Context, path string) (bool, error) {
	_, err := s.client.HeadObject(ctx, &s3.HeadObjectInput{
		Bucket: aws.String(s.bucket),
		Key:    aws.String(path),
	})

	if err != nil {
		if strings.Contains(err.Error(), "NotFound") || strings.Contains(err.Error(), "404") {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

func (s *S3Storage) GetPublicURL(ctx context.Context, path string) (string, error) {
	return fmt.Sprintf("%s/%s", s.publicURL, path), nil
}

func (s *S3Storage) PresignURL(ctx context.Context, in storageports.PresignInput) (string, error) {
	exp := in.ExpiresIn
	if exp == 0 {
		exp = 15 * time.Minute
	}

	var url string

	switch in.Method {
	case "PUT":
		resp, err := s.presigner.PresignPutObject(ctx, &s3.PutObjectInput{
			Bucket:      aws.String(s.bucket),
			Key:         aws.String(in.Path),
			ContentType: aws.String(in.ContentType),
		}, s3.WithPresignExpires(exp))
		if err != nil {
			return "", err
		}
		url = resp.URL

	case "GET":
		resp, err := s.presigner.PresignGetObject(ctx, &s3.GetObjectInput{
			Bucket: aws.String(s.bucket),
			Key:    aws.String(in.Path),
		}, s3.WithPresignExpires(exp))
		if err != nil {
			return "", err
		}
		return resp.URL, nil

	default:
		resp, err := s.presigner.PresignGetObject(ctx, &s3.GetObjectInput{
			Bucket: aws.String(s.bucket),
			Key:    aws.String(in.Path),
		}, s3.WithPresignExpires(exp))
		if err != nil {
			return "", err
		}
		url = resp.URL
	}

	return url, nil
}
