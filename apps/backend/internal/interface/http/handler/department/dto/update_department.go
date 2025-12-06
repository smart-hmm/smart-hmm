package departmenthandlerdto

type UpdateDepartmentRequest struct {
	Name      string  `json:"name" validate:"required"`
	ManagerID *string `json:"managerId" validate:"required"`
}
