package departmenthandlerdto

type CreateDepartmentRequest struct {
	Name      string  `json:"name" validate:"required"`
	ManagerID *string `json:"manager_id" validate:"required"`
}
