"use client";

import {
  FONT_SIZES,
  FONTS,
  LOCALES,
  THEMES,
  TIME_FORMATS,
  TIMEZONES,
} from "@/constants";
import { QueryKey } from "@/services/react-query/constants";
import useUpsertUserSetting from "@/services/react-query/mutations/use-upsert-user-setting";
import useUserSettings from "@/services/react-query/queries/use-user-settings";
import type { AppearanceSettings, LocalizationSettings } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { Card } from "../profile/components/card";
import { Field } from "../profile/components/field";
import { useSearchParams } from "next/navigation";

interface UserSettingsForm {
  localization: LocalizationSettings;
  appearance: AppearanceSettings;
}

type FormRegister = ReturnType<typeof useForm<UserSettingsForm>>["register"];
type FormSetValue = ReturnType<typeof useForm<UserSettingsForm>>["setValue"];

const TABS = ["localization", "appearance"] as const;
type Tab = (typeof TABS)[number];

export default function AccountSettingsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(
    (searchParams.get("tab") ?? "localization") as Tab
  );
  const [openLocale, setOpenLocale] = useState(false);
  const [openTimezone, setOpenTimezone] = useState(false);
  const [openFontFamily, setOpenFontFamily] = useState(false);
  const [openFontSize, setOpenFontSize] = useState(false);

  const { data: settings, isLoading: isLoadingSettings } = useUserSettings();
  const { mutateAsync: upsertSetting, isPending } = useUpsertUserSetting();
  const queryClient = useQueryClient();

  const { register, setValue, handleSubmit, control } =
    useForm<UserSettingsForm>({
      defaultValues: {
        localization: {
          timezone: TIMEZONES[0],
          locale: LOCALES[0],
          timeFormat: TIME_FORMATS[0].value,
        },
        appearance: {
          theme: THEMES[0].key,
          font: FONTS[0],
          fontSize: FONT_SIZES[1],
        },
      },
    });

  const appearance = useWatch({
    control,
    name: "appearance",
  });

  const localization = useWatch({
    control,
    name: "localization",
  });

  const isChanged = useMemo(() => {
    if (!settings) return true;

    if (activeTab === "appearance") {
      const serverappearance = settings.find((ele) => ele.key === "appearance");
      if (!serverappearance) return true;
      const settingValue = serverappearance.value as AppearanceSettings;

      if (settingValue.font !== appearance.font) return true;
      if (settingValue.fontSize !== appearance.fontSize) return true;
      if (settingValue.theme !== appearance.theme) return true;
    }

    if (activeTab === "localization") {
      const serverlocalization = settings.find(
        (ele) => ele.key === "localization"
      );
      if (!serverlocalization) return true;
      const settingValue = serverlocalization.value as LocalizationSettings;

      if (settingValue.locale !== localization.locale) return true;
      if (settingValue.timeFormat !== localization.timeFormat) return true;
      if (settingValue.timezone !== localization.timezone) return true;
    }

    return false;
  }, [settings, appearance, localization, activeTab]);

  async function onSubmit(values: UserSettingsForm) {
    if (activeTab === "localization") {
      await upsertSetting({
        key: "localization",
        value: values.localization,
      });
    }

    if (activeTab === "appearance") {
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

  function onDiscard() {
    if (!settings) return;

    if (activeTab === "localization") {
      const serverlocalization = settings.find(
        (ele) => ele.key === "localization"
      );
      if (!serverlocalization) return;
      setValue(
        "localization",
        serverlocalization.value as LocalizationSettings
      );
    }

    if (activeTab === "appearance") {
      const serverlocalization = settings.find(
        (ele) => ele.key === "appearance"
      );
      if (!serverlocalization) return;
      setValue("appearance", serverlocalization.value as AppearanceSettings);
    }
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
    for (const t of THEMES) {
      root.classList.remove(`theme-${t.key}`);
    }
    root.classList.add(`theme-${appearance.theme}`);
  }, [appearance]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      "--app-font-family",
      appearance.font === "Inter"
        ? "Inter, sans-serif"
        : appearance.font === "Roboto"
        ? "Roboto, sans-serif"
        : appearance.font === "Poppins"
        ? "Poppins, sans-serif"
        : appearance.font === "Montserrat"
        ? "Montserrat, sans-serif"
        : "sans-serif"
    );

    root.style.setProperty(
      "--app-font-size",
      appearance.fontSize === "sm"
        ? "14px"
        : appearance.fontSize === "lg"
        ? "18px"
        : "16px"
    );
  }, [appearance]);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-foreground)]">
      <div className="px-6 pb-10 pt-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">
            Profile settings
          </h1>

          <div className="mt-6 flex gap-8 border-b border-[var(--color-muted)] text-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                }}
                className={`pb-3 font-medium transition capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "text-slate-600 hover:text-[var(--color-foreground)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-2 max-w-5xl pb-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card title={`${activeTab} settings`}>
            {activeTab === "localization" ? (
              <LocalizationFields
                localization={localization}
                register={register}
                setValue={setValue}
                openLocale={openLocale}
                openTimezone={openTimezone}
                setOpenLocale={setOpenLocale}
                setOpenTimezone={setOpenTimezone}
              />
            ) : (
              <AppearanceFields
                appearance={appearance}
                setValue={setValue}
                openFontFamily={openFontFamily}
                openFontSize={openFontSize}
                setOpenFontFamily={setOpenFontFamily}
                setOpenFontSize={setOpenFontSize}
              />
            )}
          </Card>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-[var(--color-muted)] pt-6">
            <button
              type="button"
              disabled={!isChanged}
              onClick={onDiscard}
              className="rounded-md px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Discard
            </button>

            <button
              type="submit"
              disabled={isPending || !isChanged}
              className="rounded-md bg-[var(--color-primary)] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LocalizationFields({
  localization,
  register,
  setValue,
  openLocale,
  openTimezone,
  setOpenLocale,
  setOpenTimezone,
}: {
  localization: LocalizationSettings;
  register: FormRegister;
  setValue: FormSetValue;
  openLocale: boolean;
  openTimezone: boolean;
  setOpenLocale: (v: boolean) => void;
  setOpenTimezone: (v: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Language / Locale"
        value={
          <>
            <GridSelectTrigger
              placeholder="Select locale"
              valueLabel={localization.locale}
              onClick={() => setOpenLocale(true)}
            />

            <GridSelectModal
              open={openLocale}
              title="Select locale"
              value={localization.locale}
              onClose={() => setOpenLocale(false)}
              onSelect={(val) => setValue("localization.locale", val)}
              options={LOCALES.map((loc) => ({
                value: loc,
                label: loc,
              }))}
            />
          </>
        }
      />

      <Field
        label="Timezone"
        value={
          <SearchableSelect
            value={localization.timezone}
            placeholder="Select timezone"
            options={TIMEZONES}
            open={openTimezone}
            onOpenChange={setOpenTimezone}
            onSelect={(val) => setValue("localization.timezone", val)}
          />
        }
      />

      <Field
        label="Time format"
        value={
          <div className="flex items-center gap-4">
            {TIME_FORMATS.map((format) => (
              <label
                key={format.value}
                className="flex items-center gap-2 text-sm text-[var(--color-foreground)]"
              >
                <input
                  type="radio"
                  value={format.value}
                  {...register("localization.timeFormat")}
                  className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span>{format.label}</span>
              </label>
            ))}
          </div>
        }
      />
    </div>
  );
}

function AppearanceFields({
  appearance,
  setValue,
  openFontFamily,
  openFontSize,
  setOpenFontFamily,
  setOpenFontSize,
}: {
  appearance: AppearanceSettings;
  setValue: FormSetValue;
  openFontFamily: boolean;
  openFontSize: boolean;
  setOpenFontFamily: (v: boolean) => void;
  setOpenFontSize: (v: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Main color"
        value={
          <div className="flex flex-wrap justify-end gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.key}
                type="button"
                onClick={() => setValue("appearance.theme", theme.key)}
                className={`h-10 w-10 rounded-full border-2 transition hover:scale-105 ${
                  appearance.theme === theme.key
                    ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-background)]"
                    : "border-[var(--color-muted)]"
                }
                ${theme.key === "blue" ? "bg-blue-500" : ""}
                ${theme.key === "purple" ? "bg-purple-500" : ""}
                ${theme.key === "green" ? "bg-green-500" : ""}
                ${theme.key === "red" ? "bg-red-500" : ""}
                ${theme.key === "orange" ? "bg-orange-500" : ""}
                ${theme.key === "pink" ? "bg-pink-500" : ""}
                ${theme.key === "teal" ? "bg-teal-500" : ""}
                ${theme.key === "indigo" ? "bg-indigo-500" : ""}
                ${theme.key === "yellow" ? "bg-yellow-400" : ""}
                ${theme.key === "slate" ? "bg-slate-500" : ""}`}
                title={theme.label}
              />
            ))}
          </div>
        }
      />

      <Field
        label="Font family"
        value={
          <>
            <GridSelectTrigger
              placeholder="Select font family"
              valueLabel={appearance.font}
              onClick={() => setOpenFontFamily(true)}
            />

            <GridSelectModal
              open={openFontFamily}
              title="Select font family"
              value={appearance.font}
              onClose={() => setOpenFontFamily(false)}
              onSelect={(val) => setValue("appearance.font", val)}
              options={FONTS.map((font) => ({
                value: font,
                label: font,
              }))}
            />
          </>
        }
      />

      <Field
        label="Font size"
        value={
          <>
            <GridSelectTrigger
              placeholder="Select font size"
              valueLabel={
                appearance.fontSize === "sm"
                  ? "Small"
                  : appearance.fontSize === "lg"
                  ? "Large"
                  : "Medium"
              }
              onClick={() => setOpenFontSize(true)}
            />

            <GridSelectModal
              open={openFontSize}
              title="Select font size"
              value={appearance.fontSize}
              columns={3}
              onClose={() => setOpenFontSize(false)}
              onSelect={(val) => setValue("appearance.fontSize", val)}
              options={[
                { value: "sm", label: "Small" },
                { value: "md", label: "Medium" },
                { value: "lg", label: "Large" },
              ]}
            />
          </>
        }
      />
    </div>
  );
}

function GridSelectTrigger({
  valueLabel,
  placeholder,
  onClick,
  disabled,
}: {
  valueLabel?: string;
  placeholder: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[220px] rounded-full border border-[var(--color-muted)] bg-[var(--color-background)] px-4 py-2 text-right text-sm font-semibold text-[var(--color-foreground)] shadow-inner transition hover:bg-[var(--color-surface)] ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      {valueLabel ?? placeholder}
    </button>
  );
}

function GridSelectModal<T extends string>({
  open,
  title,
  options,
  value,
  onClose,
  onSelect,
  columns = 3,
}: {
  open: boolean;
  title: string;
  value: T | "";
  options: { value: T; label: string }[];
  columns?: number;
  onSelect: (v: T) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-[var(--color-background)] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1 text-sm text-slate-500 transition hover:bg-[var(--color-muted)]"
            aria-label="Close"
          >
            X
          </button>
        </div>

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                onClose();
              }}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition hover:bg-[var(--color-muted)] ${
                value === opt.value
                  ? "border-[var(--color-primary)]"
                  : "border-[var(--color-muted)]"
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.value && (
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchableSelect({
  value,
  placeholder,
  options,
  open,
  onOpenChange,
  onSelect,
}: {
  value: string;
  placeholder: string;
  options: string[];
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (v: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  return (
    <div className="relative min-w-[220px] text-right">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="w-full rounded-full border border-[var(--color-muted)] bg-[var(--color-background)] px-4 py-2 text-right text-sm font-semibold text-[var(--color-foreground)] shadow-inner transition hover:bg-[var(--color-surface)]"
      >
        {value || placeholder}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-[var(--color-muted)] bg-[var(--color-background)] p-3 shadow-xl">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search timezone"
            className="mb-3 w-full rounded-md border border-[var(--color-muted)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
          />
          <div className="max-h-64 overflow-auto pr-1">
            {filtered.length === 0 ? (
              <div className="py-2 text-left text-sm text-slate-500">
                No results
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => {
                    onSelect(opt);
                    setQuery("");
                    onOpenChange(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[var(--color-muted)] ${
                    opt === value
                      ? "bg-[var(--color-muted)] text-[var(--color-primary)]"
                      : "text-[var(--color-foreground)]"
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {opt === value && (
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
