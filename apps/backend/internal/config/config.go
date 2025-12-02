package config

import (
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/kelseyhightower/envconfig"
	"github.com/subosito/gotenv"
)

type Config struct {
	Database Database `validate:"required"`
}

type Database struct {
	Host     string `envconfig:"HOST" validate:"required"`
	Port     int    `envconfig:"PORT" validate:"required,gt=0"`
	User     string `envconfig:"USER" validate:"required" default:"postgres"`
	Password string `envconfig:"PASSWORD" validate:"required" default:"postgres"`
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func Load() (*Config, error) {
	_ = gotenv.Load()

	var cfg Config

	if err := envconfig.Process("DB", &cfg.Database); err != nil {
		return nil, fmt.Errorf("load DB config: %w", err)
	}

	if err := validate.Struct(cfg); err != nil {
		return nil, fmt.Errorf("validate config: %w", err)
	}

	return &cfg, nil
}
