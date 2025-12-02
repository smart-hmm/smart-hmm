package departmentdomain

import "time"

type Department struct {
	ID        string
	Name      string
	ManagerID *string
	CreatedAt time.Time
	UpdatedAt time.Time
}
