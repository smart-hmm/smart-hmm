package userrepository

import domain "github.com/smart-hmm/smart-hmm/internal/modules/user/domain"

type UserRepository interface {
	Create(user *domain.User) error
	Update(user *domain.User) error

	FindByID(id string) (*domain.User, error)
	FindByEmail(email string) (*domain.User, error)

	ListAll() ([]*domain.User, error)
}
