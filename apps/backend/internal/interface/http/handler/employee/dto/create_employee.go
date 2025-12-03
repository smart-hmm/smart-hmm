package employeehandlerdto

type CreateEmployeeRequest struct {
	Code       string  `json:"code" validate:"required"`
	FirstName  string  `json:"first_name" validate:"required"`
	LastName   string  `json:"last_name" validate:"required"`
	Email      string  `json:"email" validate:"required"`
	BaseSalary float64 `json:"base_salary" validate:"required"`
}
