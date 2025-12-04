package httprouter

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	cm "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	tokenports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/token"
	attendancehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/attendance"
	authhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/auth"
	departmenthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/department"
	emailtemplatehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/email_template"
	employeehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/employee"
	leaverequesthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_request"
	leavetypehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_type"
	payrollhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/payroll"
	systemsettingshandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/system_settings"
	userhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/user"
	"github.com/smart-hmm/smart-hmm/internal/interface/http/middleware"
	httpSwagger "github.com/swaggo/http-swagger"
)

type Args struct {
	UserHandler           *userhandler.UserHandler
	AttendanceHandler     *attendancehandler.AttendanceHandler
	PayrollHandler        *payrollhandler.PayrollHandler
	DepartmentHandler     *departmenthandler.DepartmentHandler
	EmployeeHandler       *employeehandler.EmployeeHandler
	EmailTemplateHandler  *emailtemplatehandler.EmailTemplateHandler
	LeaveRequestHandler   *leaverequesthandler.LeaveRequestHandler
	LeaveTypeHandler      *leavetypehandler.LeaveTypeHandler
	SystemSettingsHandler *systemsettingshandler.SystemSettingsHandler
	AuthHandler           *authhandler.AuthHandler
	TokenService          tokenports.Service
}

func GetRouter(args Args) *chi.Mux {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Use(cm.RequestID)
	r.Use(cm.RealIP)
	r.Use(cm.Recoverer)
	r.Use(cm.Logger)
	r.Use(cm.Timeout(60 * time.Second))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	r.Get("/swagger/*", httpSwagger.WrapHandler)

	r.Route("/api/v1", func(cr chi.Router) {
		cr.Group(func(crr chi.Router) {
			crr.Use(middleware.JWTGuard(args.TokenService))
			crr.Route("/users", args.UserHandler.Routes)
			crr.Route("/attendance", args.AttendanceHandler.Routes)
			crr.Route("/payrolls", args.PayrollHandler.Routes)
			crr.Route("/departments", args.DepartmentHandler.Routes)
			crr.Route("/employees", args.EmployeeHandler.Routes)
			crr.Route("/email-templates", args.EmailTemplateHandler.Routes)
			crr.Route("/leave-requests", args.LeaveRequestHandler.Routes)
			crr.Route("/leave-types", args.LeaveTypeHandler.Routes)
			crr.Route("/system-settings", args.SystemSettingsHandler.Routes)
		})
		cr.Group(func(crr chi.Router) {
			crr.Route("/auth", args.AuthHandler.Routes)
		})
	})

	return r
}
