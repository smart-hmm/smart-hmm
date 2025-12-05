package authusecase

import (
	"context"
	"errors"

	empDomain "github.com/smart-hmm/smart-hmm/internal/modules/employee/domain"
	employeerepository "github.com/smart-hmm/smart-hmm/internal/modules/employee/repository"
	"github.com/smart-hmm/smart-hmm/internal/modules/user/domain"
	userrepository "github.com/smart-hmm/smart-hmm/internal/modules/user/repository"
)

var (
	UserNotFoundError = errors.New("user not found")
)

type MeUsecase struct {
	userRepo userrepository.UserRepository
	empRepo  employeerepository.EmployeeRepository
}

func NewMeUsecase(userRepo userrepository.UserRepository, empRepo employeerepository.EmployeeRepository) *MeUsecase {
	return &MeUsecase{
		userRepo: userRepo,
		empRepo:  empRepo,
	}
}

func (uc *MeUsecase) Execute(ctx context.Context, userID string) (*domain.User, *empDomain.Employee, error) {
	user, err := uc.userRepo.FindByID(userID)
	if err != nil {
		return nil, nil, UserNotFoundError
	}

	employee, err := uc.empRepo.FindByID(*user.EmployeeID)

	return user, employee, nil
}
