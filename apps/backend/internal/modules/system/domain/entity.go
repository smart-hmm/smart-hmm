package domain

import (
	"errors"
	"time"
)

type SystemSetting struct {
	Key       string    `json:"key"`
	Value     any       `json:"value"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewSystemSetting(key string, value any) (*SystemSetting, error) {
	if key == "" {
		return nil, errors.New("key required")
	}

	return &SystemSetting{
		Key:       key,
		Value:     value,
		UpdatedAt: time.Now().UTC(),
	}, nil
}

func (s *SystemSetting) Update(value any) {
	s.Value = value
	s.UpdatedAt = time.Now().UTC()
}
