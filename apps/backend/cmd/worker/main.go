package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/smart-hmm/smart-hmm/internal/app"
	"github.com/smart-hmm/smart-hmm/internal/config"
	queueports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/queue"
	"github.com/smart-hmm/smart-hmm/internal/pkg/logger"
	"github.com/smart-hmm/smart-hmm/internal/worker"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cfg, err := config.Load()
	if err != nil {
		log.Fatal("load config error. Error: %v", err)
	}

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGTERM, syscall.SIGINT)

	go func() {
		<-sig
		log.Println("worker shutting down...")
		cancel()
	}()

	slog := logger.GetSugaredLogger(cfg)

	container, err := app.Build(ctx, cfg)
	if err != nil {
		slog.Panicf("build container: %w", err)
	}

	queue := container.Infrastructures.QueueService

	emailWorker := worker.NewSendEmailWorker(container.Infrastructures.MailService)
	opts := queueports.ConsumeOptions{
		Prefetch:    20,
		Concurrency: 5,
		RetryLimit:  5,
	}

	queue.ConsumeWithWorkers(ctx, "send_email", emailWorker.Handle, opts)

	<-ctx.Done()
	log.Println("worker exited safely")
}
