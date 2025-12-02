package payrolldomain

import "time"

type PayrollRecord struct {
	ID         string
	EmployeeID string
	Period     string
	BaseSalary float64
	Allowances map[string]float64
	Deductions map[string]float64
	NetSalary  float64

	GeneratedAt time.Time
}
