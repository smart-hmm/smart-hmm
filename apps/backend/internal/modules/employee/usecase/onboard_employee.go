package employeeusecase

import (
	"context"
	"encoding/json"
	"log"

	queueports "github.com/smart-hmm/smart-hmm/internal/interface/core/ports/queue"
	empDomain "github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
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
	BaseSalary float64

	CreateUser bool
	UserEmail  string
	Password   string
	Role       userDomain.UserRole
}

func (uc *OnboardEmployeeUsecase) Execute(
	ctx context.Context,
	input OnboardEmployeeInput,
) error {
	newEmp, err := empDomain.NewEmployee(input.Code, input.FirstName, input.LastName, input.Email, input.BaseSalary)
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

	payload := worker.SendEmailPayload{
		To:      input.UserEmail,
		Subject: "Welcome!",
		Body:    "<h1>Hello</h1>",
	}

	data, _ := json.Marshal(payload)

	err = uc.queueSvc.Publish(ctx, "send_email", queueports.Message{
		Body: data,
	})

	if err != nil {
		log.Default().Print(err)
	}

	return nil
}
