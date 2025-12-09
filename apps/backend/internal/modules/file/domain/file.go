package domain

import "time"

type File struct {
	ID           string  `json:"id"`
	DepartmentID *string `json:"departmentId"`

	StoragePath string `json:"storagePath"`
	Filename    string `json:"fileName"`
	ContentType string `json:"contentType"`
	Size        int64  `json:"size"`

	CreatedAt  time.Time `json:"createdAt"`
	UploadedBy *string   `json:"uploadedBy"`

	DeletedAt *time.Time `json:"deletedAt"`
}
