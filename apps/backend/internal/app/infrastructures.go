package app

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/config"
	rediscache "github.com/smart-hmm/smart-hmm/internal/infrastructure/cache/redis"
	"github.com/smart-hmm/smart-hmm/internal/infrastructure/database"
	resendmail "github.com/smart-hmm/smart-hmm/internal/infrastructure/mail/resend"
	mailports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/mail"
	"github.com/smart-hmm/smart-hmm/internal/pkg/logger"
)

type Infrastructures struct {
	MailService mailports.MailService
	DB          *pgxpool.Pool
	Redis       *rediscache.RedisService
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

	return &Infrastructures{
		MailService: mailSvc,
		DB:          db.Pool(),
		Redis:       redis,
	}, nil
}
