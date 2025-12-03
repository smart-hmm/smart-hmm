package departmenthandlerdto

type UpdateDepartmentRequest struct {
	Name      string  `json:"name" validate:"required"`
	ManagerID *string `json:"manager_id" validate:"required"`
}
