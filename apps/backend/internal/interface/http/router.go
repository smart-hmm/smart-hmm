package httprouter

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	attendancehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/attendance"
	departmenthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/department"
	employeehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/employee"
	leaverequesthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_request"
	leavetypehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_type"
	payrollhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/payroll"
	systemsettingshandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/system_settings"
	userhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/user"
)

type Args struct {
	UserHandler           *userhandler.UserHandler
	AttendanceHandler     *attendancehandler.AttendanceHandler
	PayrollHandler        *payrollhandler.PayrollHandler
	DepartmentHandler     *departmenthandler.DepartmentHandler
	EmployeeHandler       *employeehandler.EmployeeHandler
	LeaveRequestHandler   *leaverequesthandler.LeaveRequestHandler
	LeaveTypeHandler      *leavetypehandler.LeaveTypeHandler
	SystemSettingsHandler *systemsettingshandler.SystemSettingsHandler
}

func GetRouter(args Args) *chi.Mux {
	r := chi.NewRouter()

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	r.Route("/api/v1", func(cr chi.Router) {
		cr.Route("/users", args.UserHandler.Routes)
		cr.Route("/attendance", args.AttendanceHandler.Routes)
		cr.Route("/payrolls", args.PayrollHandler.Routes)
		cr.Route("/departments", args.DepartmentHandler.Routes)
		cr.Route("/employees", args.EmployeeHandler.Routes)
		cr.Route("/leave-requests", args.LeaveRequestHandler.Routes)
		cr.Route("/leave-types", args.LeaveTypeHandler.Routes)
		cr.Route("/system-settings", args.SystemSettingsHandler.Routes)
	})

	return r
}
