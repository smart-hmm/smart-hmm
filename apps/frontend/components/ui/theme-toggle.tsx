"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { persitStore, Theme } from "@/services/persit-store/store";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  useEffect(() => {
    const saved = persitStore.states.theme;
    document.documentElement.setAttribute("data-theme", saved);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    document.documentElement.setAttribute("data-theme", next);
    persitStore.actions.setTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        relative flex items-center
        w-16 h-8 p-1 rounded-full
        bg-muted shadow-lg
        transition-colors duration-300
      "
      aria-label="Toggle Theme"
    >
      <span
        className={`
          absolute top-1 left-1
          w-6 h-6 rounded-full
          bg-primary
          transition-all duration-300 ease-in-out
          ${theme === "dark" ? "translate-x-8" : "translate-x-0"}
        `}
      />

      <Sun
        size={16}
        color="white"
        className={`
          relative z-10 ml-1
          transition-opacity duration-300
          ${theme === "dark" ? "opacity-50" : "opacity-100"}
        `}
      />

      <Moon
        size={16}
        color="white"
        className={`
          relative z-10 ml-auto mr-1
          transition-opacity duration-300
          ${theme === "dark" ? "opacity-100" : "opacity-50"}
        `}
      />
    </button>
  );
}
