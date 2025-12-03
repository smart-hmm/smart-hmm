package logger

import (
	"sync"

	"github.com/smart-hmm/smart-hmm/internal/config"
	"go.uber.org/zap"
)

var (
	logger   *zap.Logger
	sugar    *zap.SugaredLogger
	initOnce sync.Once
)

func initLogger(cfg *config.Config) {
	var err error

	if cfg.App.Env == "prod" {
		logger, err = zap.NewProduction()
	} else {
		logger, err = zap.NewDevelopment()
	}

	if err != nil {
		panic(err)
	}

	sugar = logger.Sugar()
}

func GetLogger(cfg *config.Config) *zap.Logger {
	initOnce.Do(func() {
		initLogger(cfg)
	})
	return logger
}

func GetSugaredLogger(cfg *config.Config) *zap.SugaredLogger {
	initOnce.Do(func() {
		initLogger(cfg)
	})
	return sugar
}
