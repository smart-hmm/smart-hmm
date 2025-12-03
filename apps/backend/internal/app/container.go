package app

import (
	"context"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/smart-hmm/smart-hmm/internal/config"
	httprouter "github.com/smart-hmm/smart-hmm/internal/interface/http"
)

type Container struct {
	Config       *config.Config
	DB           *pgxpool.Pool
	Repositories Repositories
	Usecases     Usecases
	Handlers     Handlers
	Router       *chi.Mux
}

func Build(ctx context.Context, cfg *config.Config) (*Container, error) {
	infras, err := buildInfrastructures(ctx, cfg)
	if err != nil {
		return nil, err
	}
	repositories := buildRepositories(infras.DB)
	usecases := buildUsecases(repositories)
	handlers := buildHandlers(usecases, repositories)

	return &Container{
		Config:       cfg,
		DB:           infras.DB,
		Repositories: repositories,
		Usecases:     usecases,
		Handlers:     handlers,
		Router: httprouter.GetRouter(httprouter.Args{
			UserHandler:           handlers.User,
			AttendanceHandler:     handlers.Attendance,
			PayrollHandler:        handlers.Payroll,
			DepartmentHandler:     handlers.Department,
			EmployeeHandler:       handlers.Employee,
			LeaveRequestHandler:   handlers.LeaveRequest,
			LeaveTypeHandler:      handlers.LeaveType,
			SystemSettingsHandler: handlers.SystemSettings,
		}),
	}, nil
}
