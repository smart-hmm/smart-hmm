package domain

type TemplateStatus string

const (
	TemplateStatusDraft    TemplateStatus = "draft"
	TemplateStatusActive   TemplateStatus = "active"
	TemplateStatusArchived TemplateStatus = "archived"
)

type TemplateChannel string

const (
	TemplateChannelEmail TemplateChannel = "email"
	TemplateChannelSMS   TemplateChannel = "sms"
	TemplateChannelPush  TemplateChannel = "push"
	TemplateChannelInApp TemplateChannel = "in_app"
)
