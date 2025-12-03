package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	_ "github.com/smart-hmm/smart-hmm/docs"

	"github.com/smart-hmm/smart-hmm/internal/app"
	"github.com/smart-hmm/smart-hmm/internal/config"
	employeeusecase "github.com/smart-hmm/smart-hmm/internal/modules/employee/usecase"
	"github.com/smart-hmm/smart-hmm/internal/modules/user/domain"
	"github.com/smart-hmm/smart-hmm/internal/pkg/logger"
)

// @title SmartHRM API
// @version 1.0
// @description HRM system REST API

// @host localhost:8080
// @BasePath /api/v1

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	cfg, err := config.Load()
	if err != nil {
		panic(fmt.Sprintf("error loading config. Error: %v", err))
	}

	slog := logger.GetSugaredLogger(cfg)

	slog.Info("building app container...")
	container, err := app.Build(ctx, cfg)
	if err != nil {
		slog.Panicf("build container: %w", err)
	}

	// insertInitData(ctx, container.Usecases.OnboardEmployee)

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

func insertInitData(ctx context.Context, onboardUC *employeeusecase.OnboardEmployeeUsecase) {
	initData, err := config.LoadInitData()
	if err != nil {
		log.Fatalf("load init data failed: %v", err)
	}

	var wg sync.WaitGroup

	for _, emp := range initData.Employees {
		wg.Add(1)

		go func(user config.Employee) {
			defer wg.Done()

			onboardUC.Execute(ctx, employeeusecase.OnboardEmployeeInput{
				Code:       emp.Code,
				FirstName:  emp.FirstName,
				LastName:   emp.LastName,
				Email:      emp.Email,
				Password:   emp.Password,
				CreateUser: true,
				Phone:      emp.Phone,
				Position:   emp.Position,
				Role:       domain.UserRole(emp.Role),
				UserEmail:  emp.Email,
			}, false)
		}(emp)
	}

	wg.Wait()
	log.Println("✅ user seeding completed")
}
