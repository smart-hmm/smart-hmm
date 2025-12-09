package app

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/config"
	rediscache "github.com/smart-hmm/smart-hmm/internal/infrastructure/cache/redis"
	"github.com/smart-hmm/smart-hmm/internal/infrastructure/database"
	resendmail "github.com/smart-hmm/smart-hmm/internal/infrastructure/mail/resend"
	rabbitmqqueue "github.com/smart-hmm/smart-hmm/internal/infrastructure/queue/rabbitmq"
	s3storage "github.com/smart-hmm/smart-hmm/internal/infrastructure/storage/s3"
	jwtservice "github.com/smart-hmm/smart-hmm/internal/infrastructure/token/jwt"
	mailports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/mail"
	queueports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/queue"
	storageports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/storage"
	tokenports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/token"
	"github.com/smart-hmm/smart-hmm/internal/pkg/logger"
)

type Infrastructures struct {
	DB *pgxpool.Pool

	MailService    mailports.MailService
	QueueService   queueports.QueueService
	TokenService   tokenports.Service
	StorageService storageports.StorageService

	Redis *rediscache.RedisService
}

func buildInfrastructures(ctx context.Context, cfg *config.Config) (*Infrastructures, error) {
	slog := logger.GetSugaredLogger(cfg)

	db := database.NewPostgresDatabase(cfg)
	err := db.Open(context.Background())
	if err != nil {
		return nil, err
	}

	redis := rediscache.NewRedisService(cfg)

	mailSvc := resendmail.NewResendMailService(cfg.Resend.ApiKey)

	go func() {
		<-ctx.Done()
		slog.Info("closing database connection...")
		closeCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := db.Close(closeCtx); err != nil {
			slog.Error("db close failed", "err", err)
		}
	}()

	queue, err := rabbitmqqueue.NewRabbitMQ(cfg.RabbitMQ.DSN)
	if err != nil {
		return nil, err
	}

	tokenSvc := jwtservice.New(
		cfg.JWT.AccessSecret,
		cfg.JWT.RefreshSecret,
		time.Duration(cfg.JWT.AccessTTLMinutes)*time.Minute,
		time.Duration(cfg.JWT.RefreshTTLHours)*time.Hour,
	)

	client, _ := s3storage.NewS3Client(ctx, cfg.S3.Region)
	s3Storage := s3storage.NewS3Storage(
		client,
		cfg.S3.Bucket,
		cfg.S3.PublicURL,
	)

	infras := &Infrastructures{
		MailService:    mailSvc,
		DB:             db.Pool(),
		Redis:          redis,
		QueueService:   queue,
		TokenService:   tokenSvc,
		StorageService: s3Storage,
	}

	if infras.QueueService == nil {
		panic("QueueService is NIL after buildInfrastructures")
	}

	return infras, nil
}
