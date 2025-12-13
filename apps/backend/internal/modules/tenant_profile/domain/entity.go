package domain

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type CompanySize string

const (
	CompanySizeSmall  CompanySize = "small"
	CompanySizeMedium CompanySize = "medium"
	CompanySizeLarge  CompanySize = "large"
)

func (cs CompanySize) IsValid() bool {
	switch cs {
	case CompanySizeSmall, CompanySizeMedium, CompanySizeLarge:
		return true
	default:
		return false
	}
}

type Industry string

const (
	IndustryTechnology    Industry = "Technology"
	IndustryFinance       Industry = "Finance"
	IndustryHealthcare    Industry = "Healthcare"
	IndustryEducation     Industry = "Education"
	IndustryManufacturing Industry = "Manufacturing"
	IndustryRetail        Industry = "Retail"
	IndustryLogistics     Industry = "Logistics"
	IndustryMarketing     Industry = "Marketing"
	IndustryOther         Industry = "Other"
)

func (i Industry) IsValid() bool {
	switch i {
	case
		IndustryTechnology,
		IndustryFinance,
		IndustryHealthcare,
		IndustryEducation,
		IndustryManufacturing,
		IndustryRetail,
		IndustryLogistics,
		IndustryMarketing,
		IndustryOther:
		return true
	default:
		return false
	}
}

var (
	ErrInvalidTenantID    = errors.New("invalid tenant id")
	ErrInvalidIndustry    = errors.New("invalid industry")
	ErrInvalidCompanySize = errors.New("invalid company size")
)

type TenantProfile struct {
	ID          string
	TenantID    string
	LegalName   *string
	LogoURL     *string
	Industry    Industry
	CompanySize CompanySize
	Country     *string
	Timezone    *string
	Currency    *string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type NewTenantProfileInput struct {
	TenantID    string
	LegalName   *string
	LogoURL     *string
	Industry    Industry
	CompanySize CompanySize
	Country     *string
	Timezone    *string
	Currency    *string
}

func NewTenantProfile(in NewTenantProfileInput) (*TenantProfile, error) {
	if _, err := uuid.Parse(in.TenantID); err != nil {
		return nil, ErrInvalidTenantID
	}

	if in.Industry != "" && !in.Industry.IsValid() {
		return nil, ErrInvalidIndustry
	}

	if in.CompanySize != "" && !in.CompanySize.IsValid() {
		return nil, ErrInvalidCompanySize
	}

	now := time.Now()

	return &TenantProfile{
		ID:          "",
		TenantID:    in.TenantID,
		LegalName:   in.LegalName,
		LogoURL:     in.LogoURL,
		Industry:    in.Industry,
		CompanySize: in.CompanySize,
		Country:     in.Country,
		Timezone:    in.Timezone,
		Currency:    in.Currency,
		CreatedAt:   now,
		UpdatedAt:   now,
	}, nil
}

func (tp *TenantProfile) UpdateBranding(legalName, logoURL *string) {
	tp.LegalName = legalName
	tp.LogoURL = logoURL
	tp.UpdatedAt = time.Now()
}

func (tp *TenantProfile) UpdateBusinessInfo(
	industry Industry,
	companySize CompanySize,
) error {
	if industry != "" && !industry.IsValid() {
		return ErrInvalidIndustry
	}

	if companySize != "" && !companySize.IsValid() {
		return ErrInvalidCompanySize
	}

	tp.Industry = industry
	tp.CompanySize = companySize
	tp.UpdatedAt = time.Now()
	return nil
}

func (tp *TenantProfile) UpdateLocale(
	country, timezone, currency *string,
) {
	tp.Country = country
	tp.Timezone = timezone
	tp.Currency = currency
	tp.UpdatedAt = time.Now()
}
