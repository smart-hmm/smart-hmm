package app

import (
	attendancehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/attendance"
	departmenthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/department"
	employeehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/employee"
	leaverequesthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_request"
	leavetypehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_type"
	payrollhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/payroll"
	systemsettingshandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/system_settings"
	userhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/user"
)

type Handlers struct {
	User           *userhandler.UserHandler
	Attendance     *attendancehandler.AttendanceHandler
	Payroll        *payrollhandler.PayrollHandler
	Department     *departmenthandler.DepartmentHandler
	Employee       *employeehandler.EmployeeHandler
	LeaveRequest   *leaverequesthandler.LeaveRequestHandler
	LeaveType      *leavetypehandler.LeaveTypeHandler
	SystemSettings *systemsettingshandler.SystemSettingsHandler
}

func buildHandlers(uc Usecases, repo Repositories) Handlers {
	return Handlers{
		User:       userhandler.NewUserHandler(uc.RegisterUserUsecase, repo.User),
		Attendance: attendancehandler.NewAttendanceHandler(uc.ClockIn, uc.ClockOut, repo.Attendance),
		Payroll:    payrollhandler.NewPayrollHandler(uc.GeneratePayroll, repo.Payroll),
		Department: departmenthandler.NewDepartmentHandler(uc.CreateDepartment, uc.UpdateDepartment, repo.Department),
		Employee:   employeehandler.NewEmployeeHandler(uc.CreateEmployee, uc.UpdateEmployee, repo.Employee),
		LeaveRequest: leaverequesthandler.NewLeaveRequestHandler(
			uc.CreateLeaveRequest,
			uc.GetLeaveRequest,
			uc.ListLeaveByEmployee,
			uc.ListLeaveByStatus,
			uc.ApproveLeaveRequest,
			uc.RejectLeaveRequest,
		),
		LeaveType: leavetypehandler.NewLeaveTypeHandler(
			uc.ListLeaveTypes,
			uc.GetLeaveType,
			uc.CreateLeaveType,
			uc.UpdateLeaveType,
			uc.SoftDeleteLeaveType,
			repo.LeaveType,
		),
		SystemSettings: systemsettingshandler.NewSystemSettingsHandler(
			uc.GetSetting,
			uc.ListSettings,
			uc.UpdateSetting,
			uc.DeleteSetting,
		),
	}
}
