package config

import (
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/kelseyhightower/envconfig"
	"github.com/subosito/gotenv"
)

type Config struct {
	App      App      `validate:"required"`
	Database Database `validate:"required"`
	Resend   Resend   `validate:"required"`
	Redis    Redis    `validate:"required"`
}

type App struct {
	Env  string `validate:"required" default:"dev"`
	Port int    `validate:"required" default:"8080"`
}
type Database struct {
	Host     string `envconfig:"HOST" validate:"required"`
	Port     int    `envconfig:"PORT" validate:"required,gt=0"`
	Name     string `envconfig:"NAME" validate:"required"`
	User     string `envconfig:"USER" validate:"required" default:"postgres"`
	Password string `envconfig:"PASSWORD" validate:"required" default:"postgres"`
}

type Redis struct {
	Address string `envconfig:"ADDRESS" validate:"required"`
}

type Resend struct {
	ApiKey string `envconfig:"API_KEY" validate:"required"`
}

var validate = validator.New(validator.WithRequiredStructEnabled())

func Load() (*Config, error) {
	_ = gotenv.Load()

	var cfg Config

	if err := envconfig.Process("APP", &cfg.App); err != nil {
		return nil, fmt.Errorf("load APP config: %w", err)
	}
	if err := envconfig.Process("DB", &cfg.Database); err != nil {
		return nil, fmt.Errorf("load DB config: %w", err)
	}
	if err := envconfig.Process("REDIS", &cfg.Redis); err != nil {
		return nil, fmt.Errorf("load REDIS config: %w", err)
	}
	if err := envconfig.Process("RESEND", &cfg.Resend); err != nil {
		return nil, fmt.Errorf("load RESEND config: %w", err)
	}

	if err := validate.Struct(cfg); err != nil {
		return nil, fmt.Errorf("validate config: %w", err)
	}

	return &cfg, nil
}
