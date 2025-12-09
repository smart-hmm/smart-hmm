"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { THEMES } from "@/constants";
import { useEffect } from "react";

const ThemeLayout = ({ children }: { children: React.ReactNode }) => {
  const themeCtx = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    
    for (const theme of THEMES) {
      root.classList.remove(`theme-${theme.key}`);
    }

    root.classList.add(`theme-${themeCtx.theme.key}`);

    root.style.setProperty(
      "--app-font-family",
      themeCtx.font === "Inter"
        ? "Inter, sans-serif"
        : themeCtx.font === "Roboto"
        ? "Roboto, sans-serif"
        : themeCtx.font === "Poppins"
        ? "Poppins, sans-serif"
        : themeCtx.font === "Montserrat"
        ? "Montserrat, sans-serif"
        : "sans-serif"
    );

    root.style.setProperty(
      "--app-font-size",
      themeCtx.fontSize === "sm"
        ? "14px"
        : themeCtx.fontSize === "lg"
        ? "18px"
        : "16px"
    );
  }, [themeCtx]);

  return children;
};

export default ThemeLayout;
