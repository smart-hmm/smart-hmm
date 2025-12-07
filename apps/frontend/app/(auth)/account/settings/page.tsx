"use client";

import { FONTS, THEMES } from "@/components/providers/theme-provider";
import { QueryKey } from "@/services/react-query/constants";
import useUpsertUserSetting from "@/services/react-query/mutations/use-upsert-user-setting";
import useUserSettings from "@/services/react-query/queries/use-user-settings";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const LOCALES = ["en-US", "vi-VN", "ja-JP"];
const TIMEZONES = Intl.supportedValuesOf("timeZone");

const TIME_FORMATS = [
  { label: "24 Hours (00:00)", value: "24h" },
  { label: "12 Hours (AM/PM)", value: "12h" },
];

interface UserSettingsForm {
  localization: {
    timezone: string;
    locale: string;
    timeFormat: string;
  };
  appearance: {
    theme: string;
    font: string;
    fontSize: string;
  };
}

const TABS = ["Localization", "Appearance"] as const;

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]>("Localization");

  const { data: settings, isLoading: isLoadingSettings } = useUserSettings();

  const { mutateAsync: upsertSetting, isPending } = useUpsertUserSetting();

  const queryClient = useQueryClient();

  const { register, setValue, handleSubmit, watch } = useForm<UserSettingsForm>(
    {
      defaultValues: {
        localization: {
          timezone: TIMEZONES[0],
          locale: LOCALES[0],
          timeFormat: TIME_FORMATS[0].value,
        },
        appearance: {
          theme: "blue",
          font: "Inter",
          fontSize: "md",
        },
      },
    }
  );

  async function onSubmit(values: UserSettingsForm) {
    if (activeTab === "Localization") {
      await upsertSetting({
        key: "localization",
        value: values.localization,
      });
    }

    if (activeTab === "Appearance") {
      await upsertSetting({
        key: "appearance",
        value: values.appearance,
      });
    }

    toast.success(`Update ${activeTab.toLowerCase()} settings success`);
    queryClient.invalidateQueries({
      queryKey: [QueryKey.GET_USER_SETTINGS],
    });
  }

  useEffect(() => {
    if (!isLoadingSettings && settings) {
      const localization = settings.find((ele) => ele.key === "localization");
      const appearance = settings.find((ele) => ele.key === "appearance");

      if (localization) {
        setValue("localization", {
          locale: (localization.value.locale ?? LOCALES[0]) as string,
          timezone: (localization.value.timezone ?? TIMEZONES[0]) as string,
          timeFormat: (localization.value.timeFormat ??
            TIME_FORMATS[0].value) as string,
        });
      }

      if (appearance) {
        setValue("appearance", {
          theme: (appearance.value.theme ?? "blue") as string,
          font: (appearance.value.font ?? "Inter") as string,
          fontSize: (appearance.value.fontSize ?? "md") as string,
        });
      }
    }
  }, [settings, isLoadingSettings, setValue]);

  useEffect(() => {
    const root = document.documentElement;
    THEMES.forEach((t) => {
      root.classList.remove(`theme-${t.key}`);
    });
    root.classList.add(`theme-${watch("appearance.theme")}`);
  }, [watch("appearance.theme")]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      "--app-font-family",
      watch("appearance.font") === "Inter"
        ? "Inter, sans-serif"
        : watch("appearance.font") === "Roboto"
        ? "Roboto, sans-serif"
        : watch("appearance.font") === "Poppins"
        ? "Poppins, sans-serif"
        : watch("appearance.font") === "Montserrat"
        ? "Montserrat, sans-serif"
        : "sans-serif"
    );

    root.style.setProperty(
      "--app-font-size",
      watch("appearance.fontSize") === "sm"
        ? "14px"
        : watch("appearance.fontSize") === "lg"
        ? "18px"
        : "16px"
    );
  }, [watch("appearance.font"), watch("appearance.fontSize")]);

  return (
    <div className="p-6 max-w-full mx-auto space-y-6 bg-background text-foreground">
      <div>
        <h1 className="text-2xl font-bold text-[color:var(--theme-primary)]">
          Account Settings
        </h1>
        <p className="text-sm text-muted-foreground pt-2">
          Customize your account preferences.
        </p>
      </div>

      <div className="flex gap-4 border-b">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === tab
                ? "border-[color:var(--theme-primary)] text-[color:var(--theme-primary)]"
                : "border-transparent text-foreground/70 hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="pt-6 space-y-10">
        {activeTab === "Localization" && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold">Localization Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure system language & time zone.
              </p>
            </div>

            {/* Locale */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">Language / Locale</label>
              <select
                {...register("localization.locale")}
                className="w-full border rounded-md px-3 py-2 bg-background"
              >
                {LOCALES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Zone */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">Time Zone</label>
              <select
                {...register("localization.timezone")}
                className="w-full border rounded-md px-3 py-2 bg-background"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Format */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">Time Format</label>
              <div className="flex gap-6">
                {TIME_FORMATS.map((format) => (
                  <label
                    key={format.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={format.value}
                      {...register("localization.timeFormat")}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">{format.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Appearance" && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold">Appearance Settings</h2>
              <p className="text-sm text-muted-foreground">
                Customize look & feel.
              </p>
            </div>

            {/* Theme */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">Main color</label>
              <div className="flex flex-wrap gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.key}
                    type="button"
                    onClick={() => setValue("appearance.theme", theme.key)}
                    className={`
          w-10 h-10 rounded-full border-2 transition
          ${
            watch("appearance.theme") === theme.key
              ? "scale-110 border-[color:var(--theme-primary)] ring-2 ring-[color:var(--theme-primary)]"
              : "border-muted"
          }

                ${theme.key === "blue" && "bg-blue-500"}
                ${theme.key === "purple" && "bg-purple-500"}
                ${theme.key === "green" && "bg-green-500"}
                ${theme.key === "red" && "bg-red-500"}
                ${theme.key === "orange" && "bg-orange-500"}
                ${theme.key === "pink" && "bg-pink-500"}
                ${theme.key === "teal" && "bg-teal-500"}
                ${theme.key === "indigo" && "bg-indigo-500"}
                ${theme.key === "yellow" && "bg-yellow-400"}
                ${theme.key === "slate" && "bg-slate-500"}
        `}
                    title={theme.label}
                  />
                ))}
              </div>
            </div>

            {/* Font */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">Font Family</label>
              <select
                {...register("appearance.font")}
                className="w-full border rounded-md px-3 py-2 bg-background"
              >
                {FONTS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div className="space-y-1">
              <label className="text-sm font-semibold">Font Size</label>
              <select
                {...register("appearance.fontSize")}
                className="w-full border rounded-md px-3 py-2 bg-background"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
          </div>
        )}

        {/* ✅ SAVE BUTTON */}
        <div className="pt-10 border-t flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-[color:var(--theme-primary)] text-white rounded-md font-bold 
            cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
