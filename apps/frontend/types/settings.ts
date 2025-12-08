import { FONT_SIZES, FONTS, THEMES } from "@/constants";

export type AppSetting = Record<string, string | number | string[] | number[]>;

export type AppTheme = (typeof THEMES)[number];
export type AppFont = (typeof FONTS)[number];
export type AppFontSize = (typeof FONT_SIZES)[number];

export type AppearanceSettings = {
  theme: string;
  font: string;
  fontSize: string;
};

export type LocalizationSettings = {
  timezone: string;
  locale: string;
  timeFormat: string;
};
