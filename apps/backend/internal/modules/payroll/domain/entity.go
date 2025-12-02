package domain

import "time"

type PayrollRecord struct {
	ID         string `json:"id"`
	EmployeeID string `json:"employee_id"`

	Period string `json:"period"` // YYYY-MM

	BaseSalary float64            `json:"base_salary"`
	Allowances map[string]float64 `json:"allowances"`
	Deductions map[string]float64 `json:"deductions"`
	NetSalary  float64            `json:"net_salary"`

	GeneratedAt time.Time `json:"generated_at"`
}
