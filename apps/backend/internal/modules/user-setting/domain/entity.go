package domain

import (
	"errors"
	"time"
)

type UserSetting struct {
	UserId    string    `json:"userId"`
	Key       string    `json:"key"`
	Value     any       `json:"value"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewUserSetting(userId string, key string, value any) (*UserSetting, error) {
	if key == "" {
		return nil, errors.New("key required")
	}

	return &UserSetting{
		UserId:    userId,
		Key:       key,
		Value:     value,
		UpdatedAt: time.Now().UTC(),
	}, nil
}

func (s *UserSetting) Update(value any) {
	s.Value = value
	s.UpdatedAt = time.Now().UTC()
}
