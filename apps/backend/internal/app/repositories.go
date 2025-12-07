package app

import (
	"github.com/jackc/pgx/v5/pgxpool"
	pgrepository "github.com/smart-hmm/smart-hmm/internal/infrastructure/repository/pg"
	attendancerepository "github.com/smart-hmm/smart-hmm/internal/modules/attendance/repository"
	departmentrepository "github.com/smart-hmm/smart-hmm/internal/modules/department/repository"
	emailtemplaterepository "github.com/smart-hmm/smart-hmm/internal/modules/email_template/repository"
	employeerepository "github.com/smart-hmm/smart-hmm/internal/modules/employee/repository"
	leaverepository "github.com/smart-hmm/smart-hmm/internal/modules/leave_request/repository"
	leaverepositorytype "github.com/smart-hmm/smart-hmm/internal/modules/leave_type/repository"
	payrollrepository "github.com/smart-hmm/smart-hmm/internal/modules/payroll/repository"
	refreshtokenrepository "github.com/smart-hmm/smart-hmm/internal/modules/refresh_token/repository"
	usersettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/user-setting/repository"
	systemsettingrepository "github.com/smart-hmm/smart-hmm/internal/modules/system/repository"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
)

type Repositories struct {
	Attendance     attendancerepository.AttendanceRepository
	Payroll        payrollrepository.PayrollRepository
	Department     departmentrepository.DepartmentRepository
	Employee       employeerepository.EmployeeRepository
	LeaveRequest   leaverepository.LeaveRequestRepository
	LeaveType      leaverepositorytype.LeaveTypeRepository
	EmailTemplate  emailtemplaterepository.EmailTemplateRepository
	SystemSettings systemsettingrepository.SystemSettingRepository
	UserSettings   usersettingrepository.UserSettingRepository
	User           userrepository.UserRepository
	RefreshToken   refreshtokenrepository.RefreshTokenRepository
}

func buildRepositories(pool *pgxpool.Pool) Repositories {
	return Repositories{
		Attendance:     pgrepository.NewAttendancePostgresRepository(pool),
		Payroll:        pgrepository.NewPayrollPostgresRepository(pool),
		Department:     pgrepository.NewDepartmentPostgresRepository(pool),
		Employee:       pgrepository.NewEmployeePostgresRepository(pool),
		LeaveRequest:   pgrepository.NewLeaveRequestPostgresRepository(pool),
		LeaveType:      pgrepository.NewLeaveTypePostgresRepository(pool),
		EmailTemplate:  pgrepository.NewEmailTemplatePostgresRepository(pool),
		SystemSettings: pgrepository.NewSystemSettingPostgresRepository(pool),
		UserSettings:   pgrepository.NewUserSettingPostgresRepository(pool),
		User:           pgrepository.NewUserPostgresRepository(pool),
		RefreshToken:   pgrepository.NewRefreshTokenPostgresRepository(pool),
	}
}
