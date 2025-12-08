export const THEMES = [
  { key: "blue", label: "Blue" },
  { key: "purple", label: "Purple" },
  { key: "green", label: "Green" },
  { key: "red", label: "Red" },
  { key: "orange", label: "Orange" },
  { key: "pink", label: "Pink" },
  { key: "teal", label: "Teal" },
  { key: "indigo", label: "Indigo" },
  { key: "yellow", label: "Yellow" },
  { key: "slate", label: "Slate" },
] as const;

export const FONTS = ["Inter", "Roboto", "Poppins", "Montserrat"] as const;
export const FONT_SIZES = ["sm", "md", "lg"] as const;

export const LOCALES = ["en-US", "vi-VN", "ja-JP"];
export const TIMEZONES = Intl.supportedValuesOf("timeZone");

export const TIME_FORMATS = [
  { label: "24 Hours (00:00)", value: "24h" },
  { label: "12 Hours (AM/PM)", value: "12h" },
];
