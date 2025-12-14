package metadatadto

type CompanySize string

const (
	CompanySizeSmall  CompanySize = "small"
	CompanySizeMedium CompanySize = "medium"
	CompanySizeLarge  CompanySize = "large"
)

type CountryMetadata struct {
	Code            string   `json:"code"`
	Label           string   `json:"label"`
	Currency        string   `json:"currency"`
	DefaultTimezone string   `json:"defaultTimezone"`
	Timezones       []string `json:"timezones"`
}

type IndustryMetadata struct {
	Name     string   `json:"name"`
	Keywords []string `json:"keywords,omitempty"`
}

type TenantMetadataPayload struct {
	Industries   []IndustryMetadata `json:"industries"`
	CompanySizes []CompanySize      `json:"companySizes"`
	Countries    []CountryMetadata  `json:"countries"`
}
