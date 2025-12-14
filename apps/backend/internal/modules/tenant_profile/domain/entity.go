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
	Industry    string
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
	Industry    string
	CompanySize CompanySize
	Country     *string
	Timezone    *string
	Currency    *string
}

func NewTenantProfile(in NewTenantProfileInput) (*TenantProfile, error) {
	if _, err := uuid.Parse(in.TenantID); err != nil {
		return nil, ErrInvalidTenantID
	}

	if in.Industry == "" {
		return nil, ErrInvalidIndustry
	}

	if in.CompanySize != "" && !in.CompanySize.IsValid() {
		return nil, ErrInvalidCompanySize
	}

	now := time.Now()

	return &TenantProfile{
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

func (tp *TenantProfile) UpdateBusinessInfo(industry string, companySize CompanySize) error {
	if industry == "" {
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
