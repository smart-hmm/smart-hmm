package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/smart-hmm/smart-hmm/internal/app"
	"github.com/smart-hmm/smart-hmm/internal/config"
	"github.com/smart-hmm/smart-hmm/internal/pkg/logger"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	cfg, err := config.Load()
	if err != nil {
		panic(fmt.Sprintf("error loading config. Error: %v", err))
	}

	slog := logger.GetSugaredLogger(cfg)

	container, err := app.Build(ctx, cfg)
	if err != nil {
		slog.Panicf("build container: %w", err)
	}

	srv := app.StartServer(cfg, container.Router)

	<-ctx.Done()
	slog.Info("shutdown signal received")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Errorf("server shutdown failed: %v", err)
	}

	slog.Info("http server stopped")
	slog.Info("shutdown completed")
}
