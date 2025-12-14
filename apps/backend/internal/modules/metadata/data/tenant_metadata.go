package metadatadata

import metadatadto "github.com/smart-hmm/smart-hmm/internal/interface/http/handler/metadata/dto"

var Industries = []metadatadto.IndustryMetadata{
	// Existing
	{Name: "Technology", Keywords: []string{"tech", "software", "ai", "cloud", "it"}},
	{Name: "Finance", Keywords: []string{"bank", "finance", "capital", "investment", "fin"}},
	{Name: "Healthcare", Keywords: []string{"health", "clinic", "hospital", "medical"}},
	{Name: "Education", Keywords: []string{"school", "academy", "education", "university"}},
	{Name: "Manufacturing", Keywords: []string{"factory", "manufacturing", "industrial"}},
	{Name: "Retail", Keywords: []string{"shop", "store", "retail", "commerce"}},
	{Name: "Logistics", Keywords: []string{"logistics", "shipping", "delivery", "warehouse", "supply"}},
	{Name: "Marketing", Keywords: []string{"marketing", "advertising", "branding", "seo", "content"}},

	// New – Core Business
	{Name: "E-commerce", Keywords: []string{"ecommerce", "online store", "marketplace"}},
	{Name: "Hospitality", Keywords: []string{"hotel", "restaurant", "hospitality", "resort"}},
	{Name: "Real Estate", Keywords: []string{"real estate", "property", "housing"}},
	{Name: "Construction", Keywords: []string{"construction", "builder", "contractor"}},
	{Name: "Automotive", Keywords: []string{"automotive", "car", "vehicle", "auto"}},
	{Name: "Energy", Keywords: []string{"energy", "power", "electricity", "oil", "gas"}},
	{Name: "Telecommunications", Keywords: []string{"telecom", "network", "isp", "mobile"}},

	// Services
	{Name: "Consulting", Keywords: []string{"consulting", "advisor", "strategy"}},
	{Name: "Legal Services", Keywords: []string{"legal", "law", "attorney", "lawyer"}},
	{Name: "Accounting", Keywords: []string{"accounting", "audit", "tax", "bookkeeping"}},
	{Name: "Human Resources", Keywords: []string{"hr", "human resources", "recruitment"}},
	{Name: "Staffing & Recruitment", Keywords: []string{"recruitment", "headhunt", "talent"}},

	// Creative & Media
	{Name: "Media & Entertainment", Keywords: []string{"media", "entertainment", "film", "music"}},
	{Name: "Design", Keywords: []string{"design", "ux", "ui", "graphic"}},
	{Name: "Gaming", Keywords: []string{"game", "gaming", "esports"}},
	{Name: "Publishing", Keywords: []string{"publishing", "books", "magazine"}},

	// Science & Industry
	{Name: "Biotechnology", Keywords: []string{"biotech", "biology", "genetics"}},
	{Name: "Pharmaceuticals", Keywords: []string{"pharma", "drug", "medicine"}},
	{Name: "Agriculture", Keywords: []string{"agriculture", "farming", "agro"}},
	{Name: "Food & Beverage", Keywords: []string{"food", "beverage", "restaurant", "cafe"}},

	// Public & Non-profit
	{Name: "Government", Keywords: []string{"government", "public sector"}},
	{Name: "Non-Profit", Keywords: []string{"nonprofit", "ngo", "charity"}},
	{Name: "Education Services", Keywords: []string{"training", "course", "learning"}},

	// Tech-specific
	{Name: "Fintech", Keywords: []string{"fintech", "payments", "wallet"}},
	{Name: "Healthtech", Keywords: []string{"healthtech", "medtech"}},
	{Name: "Edtech", Keywords: []string{"edtech", "elearning"}},
	{Name: "AI & Data", Keywords: []string{"ai", "machine learning", "data", "analytics"}},
	{Name: "Cybersecurity", Keywords: []string{"security", "cyber", "infosec"}},

	// Platform / Infra
	{Name: "SaaS", Keywords: []string{"saas", "subscription", "cloud software"}},
	{Name: "Web3 & Blockchain", Keywords: []string{"blockchain", "crypto", "web3"}},

	{Name: "Other"},
}

var Countries = []metadatadto.CountryMetadata{
	{
		Code:            "VN",
		Label:           "Vietnam",
		Currency:        "VND",
		DefaultTimezone: "Asia/Ho_Chi_Minh",
		Timezones:       []string{"Asia/Ho_Chi_Minh"},
	},
	{
		Code:            "US",
		Label:           "United States",
		Currency:        "USD",
		DefaultTimezone: "America/New_York",
		Timezones: []string{
			"America/New_York",
			"America/Chicago",
			"America/Denver",
			"America/Los_Angeles",
		},
	},
	{
		Code:            "SG",
		Label:           "Singapore",
		Currency:        "SGD",
		DefaultTimezone: "Asia/Singapore",
		Timezones:       []string{"Asia/Singapore"},
	},
	{
		Code:            "JP",
		Label:           "Japan",
		Currency:        "JPY",
		DefaultTimezone: "Asia/Tokyo",
		Timezones:       []string{"Asia/Tokyo"},
	},
	{
		Code:            "KR",
		Label:           "South Korea",
		Currency:        "KRW",
		DefaultTimezone: "Asia/Seoul",
		Timezones:       []string{"Asia/Seoul"},
	},
	{
		Code:            "CN",
		Label:           "China",
		Currency:        "CNY",
		DefaultTimezone: "Asia/Shanghai",
		Timezones:       []string{"Asia/Shanghai"},
	},
	{
		Code:            "IN",
		Label:           "India",
		Currency:        "INR",
		DefaultTimezone: "Asia/Kolkata",
		Timezones:       []string{"Asia/Kolkata"},
	},
	{
		Code:            "TH",
		Label:           "Thailand",
		Currency:        "THB",
		DefaultTimezone: "Asia/Bangkok",
		Timezones:       []string{"Asia/Bangkok"},
	},
	{
		Code:            "ID",
		Label:           "Indonesia",
		Currency:        "IDR",
		DefaultTimezone: "Asia/Jakarta",
		Timezones: []string{
			"Asia/Jakarta",
			"Asia/Makassar",
			"Asia/Jayapura",
		},
	},
	{
		Code:            "PH",
		Label:           "Philippines",
		Currency:        "PHP",
		DefaultTimezone: "Asia/Manila",
		Timezones:       []string{"Asia/Manila"},
	},
	{
		Code:            "AU",
		Label:           "Australia",
		Currency:        "AUD",
		DefaultTimezone: "Australia/Sydney",
		Timezones: []string{
			"Australia/Sydney",
			"Australia/Melbourne",
			"Australia/Perth",
		},
	},
	{
		Code:            "GB",
		Label:           "United Kingdom",
		Currency:        "GBP",
		DefaultTimezone: "Europe/London",
		Timezones:       []string{"Europe/London"},
	},
	{
		Code:            "DE",
		Label:           "Germany",
		Currency:        "EUR",
		DefaultTimezone: "Europe/Berlin",
		Timezones:       []string{"Europe/Berlin"},
	},
	{
		Code:            "FR",
		Label:           "France",
		Currency:        "EUR",
		DefaultTimezone: "Europe/Paris",
		Timezones:       []string{"Europe/Paris"},
	},
	{
		Code:            "NL",
		Label:           "Netherlands",
		Currency:        "EUR",
		DefaultTimezone: "Europe/Amsterdam",
		Timezones:       []string{"Europe/Amsterdam"},
	},
	{
		Code:            "CA",
		Label:           "Canada",
		Currency:        "CAD",
		DefaultTimezone: "America/Toronto",
		Timezones: []string{
			"America/Toronto",
			"America/Vancouver",
			"America/Edmonton",
		},
	},
	{
		Code:            "BR",
		Label:           "Brazil",
		Currency:        "BRL",
		DefaultTimezone: "America/Sao_Paulo",
		Timezones: []string{
			"America/Sao_Paulo",
			"America/Manaus",
			"America/Fortaleza",
		},
	},
}
