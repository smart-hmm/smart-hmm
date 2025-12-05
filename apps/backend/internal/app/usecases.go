package app

import (
	attendanceusecase "github.com/smart-hmm/smart-hmm/internal/modules/attendance/usecase"
	authusecase "github.com/smart-hmm/smart-hmm/internal/modules/auth/usecase"
	departmentusecase "github.com/smart-hmm/smart-hmm/internal/modules/department/usecase"
	emailtemplateusecase "github.com/smart-hmm/smart-hmm/internal/modules/email_template/usecase"
	employeeusecase "github.com/smart-hmm/smart-hmm/internal/modules/employee/usecase"
	leaverequestusecase "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/usecase"
	leavetypeusecase "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/usecase"
	payrollusecase "github.com/smart-hmm/smart-hmm/internal/modules/payroll/usecase"
	refreshtokenusecase "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/usecase"
	systemsettingsusecase "github.com/smart-hmm/smart-hmm/internal/modules/system/usecase"
	userusecase "github.com/smart-hmm/smart-hmm/internal/modules/user/usecase"
)

type Usecases struct {
	ClockIn                 *attendanceusecase.ClockInUsecase
	ClockOut                *attendanceusecase.ClockOutUsecase
	GeneratePayroll         *payrollusecase.GeneratePayrollUsecase
	CreateDepartment        *departmentusecase.CreateDepartmentUsecase
	UpdateDepartment        *departmentusecase.UpdateDepartmentUsecase
	CreateEmployee          *employeeusecase.CreateEmployeeUsecase
	UpdateEmployee          *employeeusecase.UpdateEmployeeUsecase
	DeleteEmployee          *employeeusecase.DeleteEmployeeUsecase
	OnboardEmployee         *employeeusecase.OnboardEmployeeUsecase
	CreateLeaveRequest      *leaverequestusecase.CreateLeaveRequestUsecase
	GetLeaveRequest         *leaverequestusecase.GetLeaveRequest
	ListLeaveByEmployee     *leaverequestusecase.ListByEmployee
	ListLeaveByStatus       *leaverequestusecase.ListByStatus
	ApproveLeaveRequest     *leaverequestusecase.ApproveLeaveUsecase
	RejectLeaveRequest      *leaverequestusecase.RejectLeaveUsecase
	ListLeaveTypes          *leavetypeusecase.ListAllLeaveTypesUsecase
	GetLeaveType            *leavetypeusecase.GetLeaveTypeUsecase
	CreateLeaveType         *leavetypeusecase.CreateLeaveTypeUsecase
	UpdateLeaveType         *leavetypeusecase.UpdateLeaveTypeUsecase
	SoftDeleteLeaveType     *leavetypeusecase.SoftDeleteLeaveTypeUsecase
	CreateTemplate          *emailtemplateusecase.CreateTemplateUsecase
	CreateTemplateVersion   *emailtemplateusecase.CreateTemplateVersionUsecase
	ActivateTemplateVersion *emailtemplateusecase.ActivateTemplateVersionUsecase
	CreateTemplateVariable  *emailtemplateusecase.CreateTemplateVariableUsecase
	UpdateTemplateVariable  *emailtemplateusecase.UpdateTemplateVariableUsecase
	DeleteTemplateVariable  *emailtemplateusecase.DeleteTemplateVariableUsecase
	ListTemplateVariables   *emailtemplateusecase.ListTemplateVariablesUsecase
	PreviewTemplate         *emailtemplateusecase.PreviewTemplateUsecase
	GetSetting              *systemsettingsusecase.GetSettingUsecase
	ListSettings            *systemsettingsusecase.ListSettingsUsecase
	UpdateSetting           *systemsettingsusecase.UpdateSettingUsecase
	DeleteSetting           *systemsettingsusecase.DeleteSettingUsecase
	RegisterUserUsecase     *userusecase.RegisterUserUsecase
	LoginUsecase            *authusecase.LoginUsecase
	MeUsecase               *authusecase.MeUsecase
	RefreshToken            *authusecase.RefreshTokenUsecase
	LogoutRefreshToken      *refreshtokenusecase.LogoutRefreshTokenUsecase
	ForceLogoutAllUsecase   *refreshtokenusecase.ForceLogoutAllUsecase
}

func buildUsecases(repo Repositories, infras *Infrastructures) Usecases {
	createEmployee := employeeusecase.NewCreateEmployeeUsecase(repo.Employee)
	updateEmployee := employeeusecase.NewUpdateEmployeeUsecase(repo.Employee)
	deleteEmployee := employeeusecase.NewDeleteEmployeeUsecase(repo.Employee)
	registerUser := userusecase.NewRegisterUserUsecase(repo.User)
	createRefreshToken := refreshtokenusecase.NewCreateRefreshTokenUsecase(repo.RefreshToken)
	rotateRefreshToken := refreshtokenusecase.NewRotateRefreshTokenUsecase(repo.RefreshToken)

	return Usecases{
		ClockIn:                 attendanceusecase.NewClockInUsecase(repo.Attendance),
		ClockOut:                attendanceusecase.NewClockOutUsecase(repo.Attendance),
		GeneratePayroll:         payrollusecase.NewGeneratePayrollUsecase(repo.Payroll),
		CreateDepartment:        departmentusecase.NewCreateDepartmentUsecase(repo.Department),
		UpdateDepartment:        departmentusecase.NewUpdateDepartmentUsecase(repo.Department),
		CreateEmployee:          createEmployee,
		UpdateEmployee:          updateEmployee,
		DeleteEmployee:          deleteEmployee,
		OnboardEmployee:         employeeusecase.NewOnboardEmployeeUsecase(createEmployee, deleteEmployee, registerUser, infras.QueueService),
		CreateLeaveRequest:      leaverequestusecase.NewCreateLeaveRequestUsecase(repo.LeaveRequest),
		GetLeaveRequest:         leaverequestusecase.NewGetLeaveRequest(repo.LeaveRequest),
		ListLeaveByEmployee:     leaverequestusecase.NewListByEmployee(repo.LeaveRequest),
		ListLeaveByStatus:       leaverequestusecase.NewListByStatus(repo.LeaveRequest),
		ApproveLeaveRequest:     leaverequestusecase.NewApproveLeaveUsecase(repo.LeaveRequest),
		RejectLeaveRequest:      leaverequestusecase.NewRejectLeaveUsecase(repo.LeaveRequest),
		ListLeaveTypes:          leavetypeusecase.NewListLeaveTypesUsecase(repo.LeaveType),
		GetLeaveType:            leavetypeusecase.NewGetLeaveTypeUsecase(repo.LeaveType),
		CreateLeaveType:         leavetypeusecase.NewCreateLeaveTypeUsecase(repo.LeaveType),
		UpdateLeaveType:         leavetypeusecase.NewUpdateLeaveTypeUsecase(repo.LeaveType),
		SoftDeleteLeaveType:     leavetypeusecase.NewSoftDeleteLeaveTypeUsecase(repo.LeaveType),
		CreateTemplate:          emailtemplateusecase.NewCreateTemplateUsecase(repo.EmailTemplate),
		CreateTemplateVersion:   emailtemplateusecase.NewCreateTemplateVersionUsecase(repo.EmailTemplate),
		ActivateTemplateVersion: emailtemplateusecase.NewActivateTemplateVersionUsecase(repo.EmailTemplate),
		CreateTemplateVariable:  emailtemplateusecase.NewCreateTemplateVariableUsecase(repo.EmailTemplate),
		UpdateTemplateVariable:  emailtemplateusecase.NewUpdateTemplateVariableUsecase(repo.EmailTemplate),
		DeleteTemplateVariable:  emailtemplateusecase.NewDeleteTemplateVariableUsecase(repo.EmailTemplate),
		ListTemplateVariables:   emailtemplateusecase.NewListTemplateVariablesUsecase(repo.EmailTemplate),
		PreviewTemplate:         emailtemplateusecase.NewPreviewTemplateUsecase(repo.EmailTemplate),
		GetSetting:              systemsettingsusecase.NewGetSettingUsecase(repo.SystemSettings),
		ListSettings:            systemsettingsusecase.NewListSettingsUsecase(repo.SystemSettings),
		UpdateSetting:           systemsettingsusecase.NewUpdateSettingUsecase(repo.SystemSettings),
		DeleteSetting:           systemsettingsusecase.NewDeleteSettingUsecase(repo.SystemSettings),
		RegisterUserUsecase:     registerUser,
		LoginUsecase:            authusecase.NewLoginUsecase(repo.User, infras.TokenService, createRefreshToken),
		MeUsecase:               authusecase.NewMeUsecase(repo.User, repo.Employee),
		RefreshToken:            authusecase.NewRefreshTokenUsecase(repo.RefreshToken, infras.TokenService, rotateRefreshToken),
		LogoutRefreshToken:      refreshtokenusecase.NewLogoutRefreshTokenUsecase(repo.RefreshToken),
		ForceLogoutAllUsecase:   refreshtokenusecase.NewForceLogoutAllUsecase(repo.RefreshToken),
	}
}
