package employeeusecase

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	queueports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/queue"
	empDomain "github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
	emailstemplates "github.com/smart-hmm/smart-hmm/internal/templates/emails"
	"github.com/smart-hmm/smart-hmm/internal/worker"

	userDomain "github.com/smart-hmm/smart-hmm/internal/modules/user/domain"
	userusecase "github.com/smart-hmm/smart-hmm/internal/modules/user/usecase"
)

type OnboardEmployeeUsecase struct {
	createEmployeeUC *CreateEmployeeUsecase
	deleteEmployeeUC *DeleteEmployeeUsecase
	createUserUC     *userusecase.RegisterUserUsecase
	queueSvc         queueports.QueueService
}

func NewOnboardEmployeeUsecase(
	createEmployeeUC *CreateEmployeeUsecase,
	deleteEmployeeUC *DeleteEmployeeUsecase,
	createUserUC *userusecase.RegisterUserUsecase,
	queueSvc queueports.QueueService,
) *OnboardEmployeeUsecase {
	return &OnboardEmployeeUsecase{
		createEmployeeUC: createEmployeeUC,
		deleteEmployeeUC: deleteEmployeeUC,
		createUserUC:     createUserUC,
		queueSvc:         queueSvc,
	}
}

type OnboardEmployeeInput struct {
	Code       string
	FirstName  string
	LastName   string
	Email      string
	Phone      string
	Position   string
	BaseSalary float64

	CreateUser bool
	UserEmail  string
	Password   string
	Role       userDomain.UserRole
}

func (uc *OnboardEmployeeUsecase) Execute(
	ctx context.Context,
	input OnboardEmployeeInput,
	isSendMail bool,
) error {
	newEmp, err := empDomain.NewEmployee(
		input.Code, input.FirstName,
		input.LastName, input.Email, input.Phone,
		input.Position, input.BaseSalary)
	if err != nil {
		return err
	}

	employee, err := uc.createEmployeeUC.Execute(ctx, newEmp)
	if err != nil {
		return err
	}

	if input.CreateUser {
		err = uc.createUserUC.Execute(
			ctx,
			input.UserEmail,
			input.Password,
			input.Role,
			&employee.ID,
		)
		if err != nil {
			uc.deleteEmployeeUC.Execute(ctx, employee.ID)
			return err
		}
	}

	htmlBody, err := emailstemplates.RenderOnboardingEmail(emailstemplates.OnboardingEmailData{
		CompanyName:       "SmartHMM",
		CompanyAddress:    "Ho Chi Minh City, Vietnam",
		EmployeeName:      fmt.Sprintf("%s %s", input.FirstName, input.LastName),
		JobTitle:          input.Position,
		Department:        "Engineering",
		StartDate:         "2025-12-10",
		WorkspaceInfo:     "Remote",
		ManagerName:       "Nguyen Van A",
		ManagerEmail:      "manager@smarthrm.io",
		WorkEmail:         input.Email,
		TemporaryPassword: input.Password,
		CheckinTime:       "09:00 AM",
		PortalURL:         "https://hr.smarthrm.io/login",
		HrEmail:           "hr@smarthrm.io",
	})
	if err != nil {
		return err
	}

	if isSendMail {
		payload := worker.SendEmailPayload{
			To:      input.UserEmail,
			Subject: "Welcome to SmartHRM 🎉",
			Body:    htmlBody,
		}

		data, _ := json.Marshal(payload)

		err = uc.queueSvc.Publish(ctx, worker.SendEmailTopic, queueports.Message{
			Body: data,
		})
	}

	if err != nil {
		log.Default().Print(err)
	}

	return nil
}
