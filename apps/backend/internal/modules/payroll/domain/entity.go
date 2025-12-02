package domain

import (
	"errors"
	"time"
)

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

func NewPayrollRecord(
	id string,
	employeeID string,
	period string,
	base float64,
	allowances map[string]float64,
	deductions map[string]float64,
	generatedAt time.Time,
) (*PayrollRecord, error) {

	if employeeID == "" {
		return nil, errors.New("employeeID is required")
	}
	if base < 0 {
		return nil, errors.New("base salary cannot be negative")
	}
	if allowances == nil {
		allowances = map[string]float64{}
	}
	if deductions == nil {
		deductions = map[string]float64{}
	}

	p := &PayrollRecord{
		ID:          id,
		EmployeeID:  employeeID,
		Period:      period,
		BaseSalary:  base,
		Allowances:  allowances,
		Deductions:  deductions,
		GeneratedAt: generatedAt,
	}

	p.UpdateNetSalary()

	return p, nil
}

func (p *PayrollRecord) UpdateNetSalary() {
	totalAllow := 0.0
	for _, v := range p.Allowances {
		totalAllow += v
	}

	totalDeduct := 0.0
	for _, v := range p.Deductions {
		totalDeduct += v
	}

	p.NetSalary = p.BaseSalary + totalAllow - totalDeduct
}
