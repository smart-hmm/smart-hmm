package filedto

type CreateFileRequest struct {
	DepartmentID string `json:"departmentId" validate:"required,uuid4"`
	StoragePath  string `json:"storagePath" validate:"required"`

	Filename    string `json:"filename" validate:"required"`
	ContentType string `json:"contentType"`
	Size        int64  `json:"size" validate:"required,gt=0"`
}
