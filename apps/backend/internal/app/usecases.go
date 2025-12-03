package app

import (
	attendanceusecase "github.com/smart-hmm/smart-hmm/internal/modules/attendance/usecase"
	departmentusecase "github.com/smart-hmm/smart-hmm/internal/modules/department/usecase"
	employeeusecase "github.com/smart-hmm/smart-hmm/internal/modules/employee/usecase"
	leaverequestusecase "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/usecase"
	leavetypeusecase "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/usecase"
	payrollusecase "github.com/smart-hmm/smart-hmm/internal/modules/payroll/usecase"
	systemsettingsusecase "github.com/smart-hmm/smart-hmm/internal/modules/system/usecase"
	userusecase "github.com/smart-hmm/smart-hmm/internal/modules/user/usecase"
)

type Usecases struct {
	ClockIn             *attendanceusecase.ClockInUsecase
	ClockOut            *attendanceusecase.ClockOutUsecase
	GeneratePayroll     *payrollusecase.GeneratePayrollUsecase
	CreateDepartment    *departmentusecase.CreateDepartmentUsecase
	UpdateDepartment    *departmentusecase.UpdateDepartmentUsecase
	CreateEmployee      *employeeusecase.CreateEmployeeUsecase
	UpdateEmployee      *employeeusecase.UpdateEmployeeUsecase
	DeleteEmployee      *employeeusecase.DeleteEmployeeUsecase
	OnboardEmployee     *employeeusecase.OnboardEmployeeUsecase
	CreateLeaveRequest  *leaverequestusecase.CreateLeaveRequestUsecase
	GetLeaveRequest     *leaverequestusecase.GetLeaveRequest
	ListLeaveByEmployee *leaverequestusecase.ListByEmployee
	ListLeaveByStatus   *leaverequestusecase.ListByStatus
	ApproveLeaveRequest *leaverequestusecase.ApproveLeaveUsecase
	RejectLeaveRequest  *leaverequestusecase.RejectLeaveUsecase
	ListLeaveTypes      *leavetypeusecase.ListAllLeaveTypesUsecase
	GetLeaveType        *leavetypeusecase.GetLeaveTypeUsecase
	CreateLeaveType     *leavetypeusecase.CreateLeaveTypeUsecase
	UpdateLeaveType     *leavetypeusecase.UpdateLeaveTypeUsecase
	SoftDeleteLeaveType *leavetypeusecase.SoftDeleteLeaveTypeUsecase
	GetSetting          *systemsettingsusecase.GetSettingUsecase
	ListSettings        *systemsettingsusecase.ListSettingsUsecase
	UpdateSetting       *systemsettingsusecase.UpdateSettingUsecase
	DeleteSetting       *systemsettingsusecase.DeleteSettingUsecase
	RegisterUserUsecase *userusecase.RegisterUserUsecase
}

func buildUsecases(repo Repositories, infras *Infrastructures) Usecases {
	createEmployee := employeeusecase.NewCreateEmployeeUsecase(repo.Employee)
	updateEmployee := employeeusecase.NewUpdateEmployeeUsecase(repo.Employee)
	deleteEmployee := employeeusecase.NewDeleteEmployeeUsecase(repo.Employee)
	registerUser := userusecase.NewRegisterUserUsecase(repo.User)

	return Usecases{
		ClockIn:             attendanceusecase.NewClockInUsecase(repo.Attendance),
		ClockOut:            attendanceusecase.NewClockOutUsecase(repo.Attendance),
		GeneratePayroll:     payrollusecase.NewGeneratePayrollUsecase(repo.Payroll),
		CreateDepartment:    departmentusecase.NewCreateDepartmentUsecase(repo.Department),
		UpdateDepartment:    departmentusecase.NewUpdateDepartmentUsecase(repo.Department),
		CreateEmployee:      createEmployee,
		UpdateEmployee:      updateEmployee,
		OnboardEmployee:     employeeusecase.NewOnboardEmployeeUsecase(createEmployee, deleteEmployee, registerUser, infras.QueueService),
		CreateLeaveRequest:  leaverequestusecase.NewCreateLeaveRequestUsecase(repo.LeaveRequest),
		GetLeaveRequest:     leaverequestusecase.NewGetLeaveRequest(repo.LeaveRequest),
		ListLeaveByEmployee: leaverequestusecase.NewListByEmployee(repo.LeaveRequest),
		ListLeaveByStatus:   leaverequestusecase.NewListByStatus(repo.LeaveRequest),
		ApproveLeaveRequest: leaverequestusecase.NewApproveLeaveUsecase(repo.LeaveRequest),
		RejectLeaveRequest:  leaverequestusecase.NewRejectLeaveUsecase(repo.LeaveRequest),
		ListLeaveTypes:      leavetypeusecase.NewListLeaveTypesUsecase(repo.LeaveType),
		GetLeaveType:        leavetypeusecase.NewGetLeaveTypeUsecase(repo.LeaveType),
		CreateLeaveType:     leavetypeusecase.NewCreateLeaveTypeUsecase(repo.LeaveType),
		UpdateLeaveType:     leavetypeusecase.NewUpdateLeaveTypeUsecase(repo.LeaveType),
		SoftDeleteLeaveType: leavetypeusecase.NewSoftDeleteLeaveTypeUsecase(repo.LeaveType),
		GetSetting:          systemsettingsusecase.NewGetSettingUsecase(repo.SystemSettings),
		ListSettings:        systemsettingsusecase.NewListSettingsUsecase(repo.SystemSettings),
		UpdateSetting:       systemsettingsusecase.NewUpdateSettingUsecase(repo.SystemSettings),
		DeleteSetting:       systemsettingsusecase.NewDeleteSettingUsecase(repo.SystemSettings),
		RegisterUserUsecase: registerUser,
	}
}
