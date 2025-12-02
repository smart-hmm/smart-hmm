package domain

import "time"

type SystemSetting struct {
	Key       string    `json:"key"`
	Value     any       `json:"value"`
	UpdatedAt time.Time `json:"updated_at"`
}
