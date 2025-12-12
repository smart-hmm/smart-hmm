package app

import (
	aiusecase "github.com/smart-hmm/smart-hmm/internal/modules/ai/usecase"
	attendanceusecase "github.com/smart-hmm/smart-hmm/internal/modules/attendance/usecase"
	authusecase "github.com/smart-hmm/smart-hmm/internal/modules/auth/usecase"
	departmentusecase "github.com/smart-hmm/smart-hmm/internal/modules/department/usecase"
	documentusecase "github.com/smart-hmm/smart-hmm/internal/modules/document/usecase"
	emailtemplateusecase "github.com/smart-hmm/smart-hmm/internal/modules/email_template/usecase"
	employeeusecase "github.com/smart-hmm/smart-hmm/internal/modules/employee/usecase"
	fileusecase "github.com/smart-hmm/smart-hmm/internal/modules/file/usecase"
	leaverequestusecase "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/usecase"
	leavetypeusecase "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/usecase"
	payrollusecase "github.com/smart-hmm/smart-hmm/internal/modules/payroll/usecase"
	refreshtokenusecase "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/usecase"
	storageusecase "github.com/smart-hmm/smart-hmm/internal/modules/storage/usecase"
	systemsettingsusecase "github.com/smart-hmm/smart-hmm/internal/modules/system/usecase"
	usersettingsusecase "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/usecase"
	userusecase "github.com/smart-hmm/smart-hmm/internal/modules/user/usecase"
)

type Usecases struct {
	ClockIn                      *attendanceusecase.ClockInUsecase
	ClockOut                     *attendanceusecase.ClockOutUsecase
	GeneratePayroll              *payrollusecase.GeneratePayrollUsecase
	CreateDepartment             *departmentusecase.CreateDepartmentUsecase
	UpdateDepartment             *departmentusecase.UpdateDepartmentUsecase
	CreateEmployee               *employeeusecase.CreateEmployeeUsecase
	UpdateEmployee               *employeeusecase.UpdateEmployeeUsecase
	DeleteEmployee               *employeeusecase.DeleteEmployeeUsecase
	OnboardEmployee              *employeeusecase.OnboardEmployeeUsecase
	CreateLeaveRequest           *leaverequestusecase.CreateLeaveRequestUsecase
	GetLeaveRequest              *leaverequestusecase.GetLeaveRequest
	ListLeaveByEmployee          *leaverequestusecase.ListByEmployee
	ListLeaveByStatus            *leaverequestusecase.ListByStatus
	ApproveLeaveRequest          *leaverequestusecase.ApproveLeaveUsecase
	RejectLeaveRequest           *leaverequestusecase.RejectLeaveUsecase
	ListLeaveTypes               *leavetypeusecase.ListAllLeaveTypesUsecase
	GetLeaveType                 *leavetypeusecase.GetLeaveTypeUsecase
	CreateLeaveType              *leavetypeusecase.CreateLeaveTypeUsecase
	UpdateLeaveType              *leavetypeusecase.UpdateLeaveTypeUsecase
	SoftDeleteLeaveType          *leavetypeusecase.SoftDeleteLeaveTypeUsecase
	CreateTemplate               *emailtemplateusecase.CreateTemplateUsecase
	CreateTemplateVersion        *emailtemplateusecase.CreateTemplateVersionUsecase
	ActivateTemplateVersion      *emailtemplateusecase.ActivateTemplateVersionUsecase
	CreateTemplateVariable       *emailtemplateusecase.CreateTemplateVariableUsecase
	UpdateTemplateVariable       *emailtemplateusecase.UpdateTemplateVariableUsecase
	DeleteTemplateVariable       *emailtemplateusecase.DeleteTemplateVariableUsecase
	ListTemplateVariables        *emailtemplateusecase.ListTemplateVariablesUsecase
	PreviewTemplate              *emailtemplateusecase.PreviewTemplateUsecase
	GetSetting                   *systemsettingsusecase.GetSettingUsecase
	ListSettings                 *systemsettingsusecase.ListSettingsUsecase
	UpdateSetting                *systemsettingsusecase.UpdateSettingUsecase
	DeleteSetting                *systemsettingsusecase.DeleteSettingUsecase
	GetUserSetting               *usersettingsusecase.GetSettingUsecase
	ListUserSettings             *usersettingsusecase.ListSettingsUsecase
	UpdateUserSetting            *usersettingsusecase.UpdateSettingUsecase
	DeleteUserSetting            *usersettingsusecase.DeleteSettingUsecase
	RegisterUserUsecase          *userusecase.RegisterUserUsecase
	LoginUsecase                 *authusecase.LoginUsecase
	MeUsecase                    *authusecase.MeUsecase
	RefreshToken                 *authusecase.RefreshTokenUsecase
	LogoutRefreshToken           *refreshtokenusecase.LogoutRefreshTokenUsecase
	ForceLogoutAllUsecase        *refreshtokenusecase.ForceLogoutAllUsecase
	GenPresignedURLUsecase       *storageusecase.GenPresignedURLUsecase
	ConfirmUploadUsecase         *fileusecase.ConfirmUploadUsecase
	GetFileUsecase               *fileusecase.GetFileUsecase
	SoftDeleteFileUsecase        *fileusecase.SoftDeleteFileUsecase
	ListFilesByDepartmentUsecase *fileusecase.ListFilesByDepartmentUsecase
	ChuckTextUsecase             *documentusecase.ChunkTextUseCase
	IngestDocumentUseCase        *documentusecase.IngestDocumentUseCase
	AskQuestionUseCase           *aiusecase.AskQuestionUseCase
	EmbedChunkUseCase            *aiusecase.EmbedChunkUseCase
}

func buildUsecases(repo Repositories, infras *Infrastructures) Usecases {
	createEmployee := employeeusecase.NewCreateEmployeeUsecase(repo.Employee)
	updateEmployee := employeeusecase.NewUpdateEmployeeUsecase(repo.Employee)
	deleteEmployee := employeeusecase.NewDeleteEmployeeUsecase(repo.Employee)
	registerUser := userusecase.NewRegisterUserUsecase(repo.User)
	chunkTextUsecase := documentusecase.NewChunkTextUseCase()
	embedChuckUsecase := aiusecase.NewEmbedChunkUseCase(infras.OllamaClient)
	createRefreshToken := refreshtokenusecase.NewCreateRefreshTokenUsecase(repo.RefreshToken)
	rotateRefreshToken := refreshtokenusecase.NewRotateRefreshTokenUsecase(repo.RefreshToken)

	return Usecases{
		ClockIn:                      attendanceusecase.NewClockInUsecase(repo.Attendance),
		ClockOut:                     attendanceusecase.NewClockOutUsecase(repo.Attendance),
		GeneratePayroll:              payrollusecase.NewGeneratePayrollUsecase(repo.Payroll),
		CreateDepartment:             departmentusecase.NewCreateDepartmentUsecase(repo.Department),
		UpdateDepartment:             departmentusecase.NewUpdateDepartmentUsecase(repo.Department),
		CreateEmployee:               createEmployee,
		UpdateEmployee:               updateEmployee,
		DeleteEmployee:               deleteEmployee,
		OnboardEmployee:              employeeusecase.NewOnboardEmployeeUsecase(createEmployee, deleteEmployee, registerUser, infras.QueueService),
		CreateLeaveRequest:           leaverequestusecase.NewCreateLeaveRequestUsecase(repo.LeaveRequest),
		GetLeaveRequest:              leaverequestusecase.NewGetLeaveRequest(repo.LeaveRequest),
		ListLeaveByEmployee:          leaverequestusecase.NewListByEmployee(repo.LeaveRequest),
		ListLeaveByStatus:            leaverequestusecase.NewListByStatus(repo.LeaveRequest),
		ApproveLeaveRequest:          leaverequestusecase.NewApproveLeaveUsecase(repo.LeaveRequest),
		RejectLeaveRequest:           leaverequestusecase.NewRejectLeaveUsecase(repo.LeaveRequest),
		ListLeaveTypes:               leavetypeusecase.NewListLeaveTypesUsecase(repo.LeaveType),
		GetLeaveType:                 leavetypeusecase.NewGetLeaveTypeUsecase(repo.LeaveType),
		CreateLeaveType:              leavetypeusecase.NewCreateLeaveTypeUsecase(repo.LeaveType),
		UpdateLeaveType:              leavetypeusecase.NewUpdateLeaveTypeUsecase(repo.LeaveType),
		SoftDeleteLeaveType:          leavetypeusecase.NewSoftDeleteLeaveTypeUsecase(repo.LeaveType),
		CreateTemplate:               emailtemplateusecase.NewCreateTemplateUsecase(repo.EmailTemplate),
		CreateTemplateVersion:        emailtemplateusecase.NewCreateTemplateVersionUsecase(repo.EmailTemplate),
		ActivateTemplateVersion:      emailtemplateusecase.NewActivateTemplateVersionUsecase(repo.EmailTemplate),
		CreateTemplateVariable:       emailtemplateusecase.NewCreateTemplateVariableUsecase(repo.EmailTemplate),
		UpdateTemplateVariable:       emailtemplateusecase.NewUpdateTemplateVariableUsecase(repo.EmailTemplate),
		DeleteTemplateVariable:       emailtemplateusecase.NewDeleteTemplateVariableUsecase(repo.EmailTemplate),
		ListTemplateVariables:        emailtemplateusecase.NewListTemplateVariablesUsecase(repo.EmailTemplate),
		PreviewTemplate:              emailtemplateusecase.NewPreviewTemplateUsecase(repo.EmailTemplate),
		GetSetting:                   systemsettingsusecase.NewGetSettingUsecase(repo.SystemSettings),
		ListSettings:                 systemsettingsusecase.NewListSettingsUsecase(repo.SystemSettings),
		UpdateSetting:                systemsettingsusecase.NewUpdateSettingUsecase(repo.SystemSettings),
		DeleteSetting:                systemsettingsusecase.NewDeleteSettingUsecase(repo.SystemSettings),
		GetUserSetting:               usersettingsusecase.NewGetSettingUsecase(repo.UserSettings),
		ListUserSettings:             usersettingsusecase.NewListSettingsUsecase(repo.UserSettings),
		UpdateUserSetting:            usersettingsusecase.NewUpdateSettingUsecase(repo.UserSettings),
		DeleteUserSetting:            usersettingsusecase.NewDeleteSettingUsecase(repo.UserSettings),
		RegisterUserUsecase:          registerUser,
		LoginUsecase:                 authusecase.NewLoginUsecase(repo.User, infras.TokenService, createRefreshToken),
		MeUsecase:                    authusecase.NewMeUsecase(repo.User, repo.Employee),
		RefreshToken:                 authusecase.NewRefreshTokenUsecase(repo.RefreshToken, infras.TokenService, rotateRefreshToken),
		LogoutRefreshToken:           refreshtokenusecase.NewLogoutRefreshTokenUsecase(repo.RefreshToken),
		ForceLogoutAllUsecase:        refreshtokenusecase.NewForceLogoutAllUsecase(repo.RefreshToken),
		GenPresignedURLUsecase:       storageusecase.NewGenPresignedURLUsecase(infras.StorageService),
		ConfirmUploadUsecase:         fileusecase.NewConfirmUploadUsecase(repo.File),
		GetFileUsecase:               fileusecase.NewGetFileUsecase(repo.File, storageusecase.NewGetPresignedDownloadURLUsecase(infras.StorageService)),
		ListFilesByDepartmentUsecase: fileusecase.NewListFilesByDepartmentUsecase(repo.File),
		SoftDeleteFileUsecase:        fileusecase.NewSoftDeleteFileUsecase(repo.File),
		ChuckTextUsecase:             chunkTextUsecase,
		IngestDocumentUseCase:        documentusecase.NewIngestDocumentUseCase(repo.Document, chunkTextUsecase, embedChuckUsecase),
		EmbedChunkUseCase:            embedChuckUsecase,
		AskQuestionUseCase:           aiusecase.NewAskQuestionUseCase(repo.Document, embedChuckUsecase, infras.OllamaClient),
	}
}
