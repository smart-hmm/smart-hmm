package domain

import "time"

type Department struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	ManagerID *string `json:"manager_id"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
