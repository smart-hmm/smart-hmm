package emailstemplates

import (
	"bytes"
	"html/template"
)

type OnboardingEmailData struct {
	CompanyName       string
	CompanyAddress    string
	EmployeeName      string
	JobTitle          string
	Department        string
	StartDate         string
	WorkspaceInfo     string
	ManagerName       string
	ManagerEmail      string
	WorkEmail         string
	TemporaryPassword string
	CheckinTime       string
	PortalURL         string
	HrEmail           string
}

func RenderOnboardingEmail(data OnboardingEmailData) (string, error) {
	tpl, err := template.ParseFiles("internal/templates/emails/onboarding.html")
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := tpl.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}
