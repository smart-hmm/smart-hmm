package app

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/smart-hmm/smart-hmm/internal/config"
	"github.com/smart-hmm/smart-hmm/internal/pkg/logger"
)

func StartServer(cfg *config.Config, router *chi.Mux) *http.Server {
	slog := logger.GetSugaredLogger(cfg)
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.App.Port),
		Handler: router,
	}

	go func() {
		slog.Infof("starting server at port %d ...", cfg.App.Port)

		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Errorf("server crashed: %v", err)
		}
	}()

	return srv
}
