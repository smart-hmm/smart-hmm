"use client";

import Loading from "@/app/loading";
import { FONT_SIZES, FONTS, THEMES } from "@/constants";
import useUserSettings from "@/services/react-query/queries/use-user-settings";
import { AppFont, AppFontSize, AppTheme } from "@/types";
import { createContext, useContext, useMemo } from "react";

type ThemeContextType = {
  theme: AppTheme;
  fontSize: AppFontSize;
  font: AppFont;
};

const DEFAULT_THEME = THEMES[0];
const DEFAULT_FONT = FONTS[0];
const DEFAULT_FONT_SIZE = FONT_SIZES[0];

const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading } = useUserSettings();

  const appearance = useMemo(
    () => data?.find((ele) => ele.key === "appearance"),
    [data]
  );

  const value = useMemo<ThemeContextType>(() => {
    const theme =
      THEMES.find(
        (ele) => ele.key === (appearance?.value?.theme ?? DEFAULT_THEME.key)
      ) ?? DEFAULT_THEME;

    const font =
      FONTS.find((f) => f === appearance?.value?.font) ?? DEFAULT_FONT;

    const fontSize =
      FONT_SIZES.find((s) => s === appearance?.value?.fontSize) ??
      DEFAULT_FONT_SIZE;

    return { theme, font, fontSize };
  }, [appearance]);

  if (isLoading) return <Loading />;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
};
