package payrollhandlerdto

type GeneratePayrollRequest struct {
	EmployeeID string             `json:"employee_id" validate:"required"`
	Period     string             `json:"period" validate:"required"`
	BaseSalary float64            `json:"base_salary" validate:"required"`
	Allowances map[string]float64 `json:"allowances" validate:"required"`
	Deductions map[string]float64 `json:"deductions" validate:"required"`
}
