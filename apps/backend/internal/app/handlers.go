package app

import (
	aihandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/ai"
	attendancehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/attendance"
	authhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/auth"
	departmenthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/department"
	documenthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/document"
	emailtemplatehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/email_template"
	employeehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/employee"
	filehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/file"
	leaverequesthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_request"
	leavetypehandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/leave_type"
	metadatahandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/metadata"
	payrollhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/payroll"
	systemsettingshandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/system_settings"
	tenanthandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/tenant"
	uploadhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/upload"
	userhandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/user"
	usersettingshandler "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/user_settings"
)

type Handlers struct {
	User           *userhandler.UserHandler
	Attendance     *attendancehandler.AttendanceHandler
	Payroll        *payrollhandler.PayrollHandler
	Department     *departmenthandler.DepartmentHandler
	Employee       *employeehandler.EmployeeHandler
	EmailTemplate  *emailtemplatehandler.EmailTemplateHandler
	LeaveRequest   *leaverequesthandler.LeaveRequestHandler
	LeaveType      *leavetypehandler.LeaveTypeHandler
	SystemSettings *systemsettingshandler.SystemSettingsHandler
	UserSettings   *usersettingshandler.UserSettingsHandler
	Auth           *authhandler.AuthHandler
	Upload         *uploadhandler.UploadHandler
	File           *filehandler.FileHandler
	Document       *documenthandler.DocumentHandler
	AI             *aihandler.AIHandler
	Tenant         *tenanthandler.TenantHandler
	Metadata       *metadatahandler.MetadataHandler
}

func buildHandlers(uc Usecases, repo Repositories) Handlers {
	return Handlers{
		User:       userhandler.NewUserHandler(uc.RegisterUserUsecase, repo.User),
		Attendance: attendancehandler.NewAttendanceHandler(uc.ClockIn, uc.ClockOut, repo.Attendance),
		Payroll:    payrollhandler.NewPayrollHandler(uc.GeneratePayroll, repo.Payroll),
		Department: departmenthandler.NewDepartmentHandler(uc.CreateDepartment, uc.UpdateDepartment, repo.Department),
		Employee:   employeehandler.NewEmployeeHandler(uc.CreateEmployee, uc.UpdateEmployee, uc.OnboardEmployee, repo.Employee),
		EmailTemplate: emailtemplatehandler.NewEmailTemplateHandler(
			uc.CreateTemplate,
			uc.CreateTemplateVersion,
			uc.ActivateTemplateVersion,
			uc.CreateTemplateVariable,
			uc.UpdateTemplateVariable,
			uc.DeleteTemplateVariable,
			uc.ListTemplateVariables,
			uc.PreviewTemplate,
			repo.EmailTemplate,
		),
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
		UserSettings: usersettingshandler.NewUserSettingsHandler(
			uc.GetUserSetting,
			uc.ListUserSettings,
			uc.UpdateUserSetting,
			uc.DeleteUserSetting,
		),
		Auth: authhandler.NewAuthHandler(
			uc.LoginUsecase,
			uc.MeUsecase,
			uc.RefreshToken,
			uc.LogoutRefreshToken,
			uc.ForceLogoutAllUsecase,
			uc.GetTenantsByUserId,
		),
		Upload: uploadhandler.NewUploadHandler(
			uc.GenPresignedURLUsecase,
		),
		File: filehandler.NewFileHandler(
			uc.GetFileUsecase,
			uc.ListFilesByDepartmentUsecase,
			uc.ConfirmUploadUsecase,
			uc.SoftDeleteFileUsecase,
			repo.File,
		),
		Document: documenthandler.NewDocumentHandler(uc.IngestDocumentUseCase),
		AI:       aihandler.NewAIHandler(uc.AskQuestionUseCase),
		Tenant: tenanthandler.NewTenantHandler(
			uc.CreateTenantUseCase,
			uc.UpdateTenantUseCase,
			uc.DeleteTenantUseCase,
			uc.GetTenantByIdUseCase,
			uc.CreateTenantWithOwner,
			uc.CreateNewTenantProfile,
			uc.GetTenantBySlugUseCase,
			uc.CheckIfSlugExisted,
		),
		Metadata: metadatahandler.NewMetadataHandler(uc.GetTenantMetadata),
	}
}
