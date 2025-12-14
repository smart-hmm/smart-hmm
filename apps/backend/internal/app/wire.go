//go:build wireinject
// +build wireinject

package app

import (
	"context"

	"github.com/google/wire"
	"github.com/smart-hmm/smart-hmm/internal/config"
)

func Build(ctx context.Context, cfg *config.Config) (*Container, error) {
	wire.Build(
		buildInfrastructures,
		provideDBPool,
		buildRepositories,
		buildUsecases,
		buildHandlers,
		buildRouter,
		buildContainer,
	)
	return &Container{}, nil
}
