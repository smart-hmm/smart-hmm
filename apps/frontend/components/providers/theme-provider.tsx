"use client";

import Loading from "@/app/loading";
import useUserSettings from "@/services/react-query/queries/use-user-settings";
import { useLayoutEffect } from "react";

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
];

export const FONTS = ["Inter", "Roboto", "Poppins", "Montserrat"] as const;
export const FONT_SIZES = ["sm", "md", "lg"] as const;

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading } = useUserSettings();
  useLayoutEffect(() => {
    if (!data || isLoading) return;
    const appearance = data.find((ele) => ele.key === "appearance");
    if (!appearance) return;

    const root = document.documentElement;
    THEMES.forEach((t) => {
      root.classList.remove(`theme-${t.key}`);
    });

    root.classList.add(`theme-${appearance.value.theme as string}`);

    root.style.setProperty(
      "--app-font-family",
      appearance.value.font === "Inter"
        ? "Inter, sans-serif"
        : appearance.value.font === "Roboto"
        ? "Roboto, sans-serif"
        : appearance.value.font === "Poppins"
        ? "Poppins, sans-serif"
        : appearance.value.font === "Montserrat"
        ? "Montserrat, sans-serif"
        : "sans-serif"
    );

    root.style.setProperty(
      "--app-font-size",
      appearance.value.fontSize === "sm"
        ? "14px"
        : appearance.value.fontSize === "lg"
        ? "18px"
        : "16px"
    );
  }, [data, isLoading]);

  if (isLoading) return <Loading />;

  return children;
}
