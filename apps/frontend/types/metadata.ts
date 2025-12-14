export interface Industry {
  name: string;
  keywords?: string[];
}

export interface Country {
  code: string;
  label: string;
  currency: string;
  defaultTimezone: string;
  timezones: string[];
}

export interface TenantMetadataConfig {
  industries: Industry[];
  companySizes: string[];
  countries: Country[];
}
