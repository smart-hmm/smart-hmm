package app

import (
	"github.com/go-chi/chi/v5"
	"github.com/smart-hmm/smart-hmm/internal/config"
	httprouter "github.com/smart-hmm/smart-hmm/internal/interface/http"
)

type Container struct {
	Config          *config.Config
	Infrastructures *Infrastructures
	Repositories    Repositories
	Usecases        Usecases
	Handlers        Handlers
	Router          *chi.Mux
}

func buildRouter(handlers Handlers, infras *Infrastructures) *chi.Mux {
	return httprouter.GetRouter(httprouter.Args{
		UserHandler:           handlers.User,
		AttendanceHandler:     handlers.Attendance,
		PayrollHandler:        handlers.Payroll,
		DepartmentHandler:     handlers.Department,
		EmployeeHandler:       handlers.Employee,
		EmailTemplateHandler:  handlers.EmailTemplate,
		LeaveRequestHandler:   handlers.LeaveRequest,
		LeaveTypeHandler:      handlers.LeaveType,
		SystemSettingsHandler: handlers.SystemSettings,
		UserSettingsHandler:   handlers.UserSettings,
		AuthHandler:           handlers.Auth,
		UploadHandler:         handlers.Upload,
		FileHandler:           handlers.File,
		DocumentHandler:       handlers.Document,
		AIHandler:             handlers.AI,
		TokenService:          infras.TokenService,
		TenantHandler:         handlers.Tenant,
	})
}

func buildContainer(cfg *config.Config, infras *Infrastructures, repositories Repositories, usecases Usecases, handlers Handlers, router *chi.Mux) *Container {
	return &Container{
		Config:          cfg,
		Infrastructures: infras,
		Repositories:    repositories,
		Usecases:        usecases,
		Handlers:        handlers,
		Router:          router,
	}
}
