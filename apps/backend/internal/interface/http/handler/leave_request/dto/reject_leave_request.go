package leaverequestdto

type RejectLeaveRequestRequest struct {
	RejectedBy string `json:"rejected_by" validate:"required"`
	Reason     string `json:"reason" validate:"required"`
}
