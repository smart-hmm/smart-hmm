"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Flags from "country-flag-icons/react/3x2";
import useOnboarding from "@/services/react-query/mutations/use-onboarding";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Logistics",
  "Marketing",
  "Other",
] as const;

type CompanySize = "small" | "medium" | "large";

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  Technology: ["tech", "software", "ai", "cloud", "it"],
  Finance: ["bank", "finance", "capital", "investment", "fin"],
  Healthcare: ["health", "clinic", "hospital", "medical"],
  Education: ["school", "academy", "education", "university"],
  Retail: ["shop", "store", "retail", "commerce"],
  Manufacturing: ["factory", "manufacturing", "industrial"],
};

function inferIndustryFromName(name: string): string | null {
  const lower = name.toLowerCase();
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) {
      return industry;
    }
  }
  return null;
}

const COUNTRY_MAP: Record<
  string,
  {
    label: string;
    currency: string;
    defaultTimezone: string;
    timezones: string[];
  }
> = {
  VN: {
    label: "Vietnam",
    currency: "VND",
    defaultTimezone: "Asia/Ho_Chi_Minh",
    timezones: ["Asia/Ho_Chi_Minh"],
  },

  US: {
    label: "United States",
    currency: "USD",
    defaultTimezone: "America/New_York",
    timezones: [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
    ],
  },

  CA: {
    label: "Canada",
    currency: "CAD",
    defaultTimezone: "America/Toronto",
    timezones: ["America/Toronto", "America/Vancouver", "America/Edmonton"],
  },

  GB: {
    label: "United Kingdom",
    currency: "GBP",
    defaultTimezone: "Europe/London",
    timezones: ["Europe/London"],
  },

  SG: {
    label: "Singapore",
    currency: "SGD",
    defaultTimezone: "Asia/Singapore",
    timezones: ["Asia/Singapore"],
  },

  JP: {
    label: "Japan",
    currency: "JPY",
    defaultTimezone: "Asia/Tokyo",
    timezones: ["Asia/Tokyo"],
  },

  KR: {
    label: "South Korea",
    currency: "KRW",
    defaultTimezone: "Asia/Seoul",
    timezones: ["Asia/Seoul"],
  },

  CN: {
    label: "China",
    currency: "CNY",
    defaultTimezone: "Asia/Shanghai",
    timezones: ["Asia/Shanghai"],
  },

  IN: {
    label: "India",
    currency: "INR",
    defaultTimezone: "Asia/Kolkata",
    timezones: ["Asia/Kolkata"],
  },

  TH: {
    label: "Thailand",
    currency: "THB",
    defaultTimezone: "Asia/Bangkok",
    timezones: ["Asia/Bangkok"],
  },

  ID: {
    label: "Indonesia",
    currency: "IDR",
    defaultTimezone: "Asia/Jakarta",
    timezones: ["Asia/Jakarta", "Asia/Makassar"],
  },

  AU: {
    label: "Australia",
    currency: "AUD",
    defaultTimezone: "Australia/Sydney",
    timezones: [
      "Australia/Sydney",
      "Australia/Melbourne",
      "Australia/Perth",
      "Australia/Brisbane",
    ],
  },

  NZ: {
    label: "New Zealand",
    currency: "NZD",
    defaultTimezone: "Pacific/Auckland",
    timezones: ["Pacific/Auckland"],
  },

  DE: {
    label: "Germany",
    currency: "EUR",
    defaultTimezone: "Europe/Berlin",
    timezones: ["Europe/Berlin"],
  },

  FR: {
    label: "France",
    currency: "EUR",
    defaultTimezone: "Europe/Paris",
    timezones: ["Europe/Paris"],
  },

  NL: {
    label: "Netherlands",
    currency: "EUR",
    defaultTimezone: "Europe/Amsterdam",
    timezones: ["Europe/Amsterdam"],
  },

  ES: {
    label: "Spain",
    currency: "EUR",
    defaultTimezone: "Europe/Madrid",
    timezones: ["Europe/Madrid"],
  },

  IT: {
    label: "Italy",
    currency: "EUR",
    defaultTimezone: "Europe/Rome",
    timezones: ["Europe/Rome"],
  },

  BR: {
    label: "Brazil",
    currency: "BRL",
    defaultTimezone: "America/Sao_Paulo",
    timezones: ["America/Sao_Paulo", "America/Manaus"],
  },

  MX: {
    label: "Mexico",
    currency: "MXN",
    defaultTimezone: "America/Mexico_City",
    timezones: ["America/Mexico_City"],
  },

  AR: {
    label: "Argentina",
    currency: "ARS",
    defaultTimezone: "America/Argentina/Buenos_Aires",
    timezones: ["America/Argentina/Buenos_Aires"],
  },
};

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
  options: {
    value: T;
    label: string;
    icon?: string;
    Flag?: Flags.FlagComponent;
  }[];
  columns?: number;
  onSelect: (v: T) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="relative z-10 w-full max-w-3xl rounded-2xl bg-background p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-muted"
          >
            ✕
          </button>
        </div>

        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {options.map(({ value, label, Flag }) => (
            <button
              key={value}
              onClick={() => {
                onSelect(value);
                onClose();
              }}
              className="flex items-center gap-3 rounded-xl border border-foreground/20 
              cursor-pointer p-4 hover:bg-muted transition"
            >
              {Flag && <Flag className="h-5 w-7" title={label} />}

              <span className="font-medium text-sm">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function GridSelectTrigger({
  label,
  valueLabel,
  placeholder,
  onClick,
  disabled,
}: {
  label: string;
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
      className={`w-full rounded-lg border px-3 py-2 text-left text-sm
        ${disabled ? "bg-slate-50 text-slate-400" : ""}
      `}
    >
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium">{valueLabel ?? placeholder}</div>
    </button>
  );
}

export default function TenantOnboardingPage() {
  const [screen, setScreen] = useState<"intro" | "form" | "success">("intro");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [industry, setIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [companySize, setCompanySize] = useState<CompanySize | null>(null);

  // 🌍 Locale (ADDED)
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [currency, setCurrency] = useState("");

  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCountry, setOpenCountry] = useState(false);
  const [openTimezone, setOpenTimezone] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);

  const { mutateAsync: onboarding, isPending: isPendingOnboarding } =
    useOnboarding();

  const countryConfig = country ? COUNTRY_MAP[country] : null;

  useEffect(() => {
    const saved = localStorage.getItem("tenant_onboarding");
    if (!saved) return;

    try {
      const d = JSON.parse(saved);
      if (d.screen) setScreen(d.screen);
      if (d.name) setName(d.name);
      if (d.slug) setSlug(d.slug);
      if (d.slugTouched) setSlugTouched(d.slugTouched);
      if (d.industry) setIndustry(d.industry);
      if (d.customIndustry) setCustomIndustry(d.customIndustry);
      if (d.companySize) setCompanySize(d.companySize);
      if (d.country) setCountry(d.country);
      if (d.timezone) setTimezone(d.timezone);
      if (d.currency) setCurrency(d.currency);
    } catch {}
  }, []);

  useEffect(() => {
    if (screen === "success") return;

    localStorage.setItem(
      "tenant_onboarding",
      JSON.stringify({
        screen,
        name,
        slug,
        slugTouched,
        industry,
        customIndustry,
        companySize,
        country,
        timezone,
        currency,
      })
    );
  }, [
    screen,
    name,
    slug,
    slugTouched,
    industry,
    customIndustry,
    companySize,
    country,
    timezone,
    currency,
  ]);

  useEffect(() => {
    if (!country) return;

    const cfg = COUNTRY_MAP[country];
    if (!cfg) return;
    if (!timezone) setTimezone(cfg.defaultTimezone);
    if (!currency) setCurrency(cfg.currency);
  }, [country]);

  useEffect(() => {
    if (!slug) {
      setSlugAvailable(null);
      return;
    }

    const t = setTimeout(async () => {
      setCheckingSlug(true);
      try {
        const res = await fetch(
          `/api/tenants/check-slug?slug=${encodeURIComponent(slug)}`
        );
        const data = await res.json();
        setSlugAvailable(data.available);
      } catch {
        setSlugAvailable(null);
      } finally {
        setCheckingSlug(false);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [slug]);

  async function submit() {
    if (!companySize) return;

    setLoading(true);
    setError(null);

    try {
      await onboarding({
        companySize,
        country,
        currency,
        industry,
        name,
        slug,
        timezone,
      });

      localStorage.removeItem("tenant_onboarding");
      setScreen("success");

      setTimeout(() => {
        window.location.href = `/guide`;
      }, 900);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  const progress =
    screen === "intro"
      ? "20%"
      : screen === "form"
      ? loading
        ? "90%"
        : "60%"
      : "100%";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-6 h-1 w-full overflow-hidden rounded bg-slate-200">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: progress }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <AnimatePresence mode="wait">
          {screen === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-2xl bg-background p-10 shadow-sm text-center"
            >
              <h1 className="text-2xl font-semibold">Welcome</h1>
              <p className="mt-3 text-sm text-slate-500">
                Create your company workspace in under a minute.
              </p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setScreen("form")}
                className="mt-8 w-full rounded-lg bg-primary py-2 text-sm text-white"
              >
                Get started
              </motion.button>
            </motion.div>
          )}

          {screen === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="rounded-2xl bg-background p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">Create your tenant</h2>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium">
                    Tenant name
                  </label>
                  <p className="mb-1 text-xs text-slate-500">
                    Visible to everyone in your workspace.
                  </p>
                  <input
                    value={name}
                    onChange={(e) => {
                      const v = e.target.value;
                      setName(v);

                      if (!slugTouched) {
                        setSlug(
                          v
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")
                        );
                      }

                      if (!industry) {
                        const inferred = inferIndustryFromName(v);
                        if (inferred) setIndustry(inferred);
                      }
                    }}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Tenant URL
                  </label>
                  <p className="mb-1 text-xs text-slate-500">
                    This will be your workspace address.
                  </p>

                  <div
                    className={`flex items-center rounded-lg border px-3 py-2
                      ${
                        slugAvailable === false
                          ? "border-red-400"
                          : slugAvailable === true
                          ? "border-green-400"
                          : "border-muted"
                      }`}
                  >
                    <span className="text-sm text-slate-400">
                      app.yourhrm.com/
                    </span>
                    <input
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setSlug(e.target.value);
                      }}
                      className="ml-1 w-full bg-transparent text-sm focus:outline-none"
                    />
                  </div>

                  <div className="mt-1 text-xs">
                    {checkingSlug && (
                      <span className="text-slate-400">
                        Checking availability…
                      </span>
                    )}
                    {slugAvailable === true && (
                      <span className="text-green-600">✓ Available</span>
                    )}
                    {slugAvailable === false && (
                      <span className="text-red-600">
                        This URL is already taken
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Industry</label>
                  <p className="mb-2 text-xs text-slate-500">
                    Used to tailor defaults for your business.
                  </p>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {INDUSTRIES.map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setIndustry(i)}
                        className={`rounded-lg border px-3 py-2 text-sm
                          ${
                            industry === i
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-muted"
                          }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>

                  {industry === "Other" && (
                    <input
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      placeholder="Your industry"
                      className="mt-3 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Company size
                  </label>
                  <p className="mb-2 text-xs text-slate-500">
                    Used to configure permissions and features.
                  </p>

                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      { key: "small", label: "Small", desc: "~50 people" },
                      { key: "medium", label: "Medium", desc: "~100 people" },
                      { key: "large", label: "Large", desc: "100+ people" },
                    ].map((o) => (
                      <button
                        key={o.key}
                        type="button"
                        onClick={() => setCompanySize(o.key as CompanySize)}
                        className={`rounded-xl border p-4 text-left
                          ${
                            companySize === o.key
                              ? "border-primary bg-primary/10"
                              : "border-muted"
                          }`}
                      >
                        <div className="font-medium">{o.label}</div>
                        <div className="text-xs text-slate-500">{o.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <GridSelectTrigger
                    label="Country"
                    placeholder="Select country"
                    valueLabel={
                      country ? COUNTRY_MAP[country].label : undefined
                    }
                    onClick={() => setOpenCountry(true)}
                  />

                  <GridSelectModal
                    open={openCountry}
                    title="Select country"
                    value={country}
                    columns={3}
                    onClose={() => setOpenCountry(false)}
                    onSelect={(code) => {
                      setCountry(code);
                      setTimezone(COUNTRY_MAP[code].defaultTimezone);
                      setCurrency(COUNTRY_MAP[code].currency);
                    }}
                    options={Object.entries(COUNTRY_MAP).map(([code, c]) => ({
                      value: code,
                      label: c.label,
                      Flag: Flags[code as keyof typeof Flags],
                    }))}
                  />

                  <GridSelectTrigger
                    label="Timezone"
                    placeholder="Select timezone"
                    valueLabel={timezone || undefined}
                    disabled={!country}
                    onClick={() => setOpenTimezone(true)}
                  />

                  <GridSelectModal
                    open={openTimezone}
                    title="Select timezone"
                    value={timezone}
                    columns={2}
                    onClose={() => setOpenTimezone(false)}
                    onSelect={setTimezone}
                    options={
                      countryConfig
                        ? countryConfig.timezones.map((tz) => ({
                            value: tz,
                            label: tz,
                          }))
                        : []
                    }
                  />
                  <GridSelectTrigger
                    label="Currency"
                    placeholder="Select currency"
                    valueLabel={currency || undefined}
                    disabled={!country}
                    onClick={() => setOpenCurrency(true)}
                  />

                  <GridSelectModal
                    open={openCurrency}
                    title="Select currency"
                    value={currency}
                    columns={3}
                    onClose={() => setOpenCurrency(false)}
                    onSelect={setCurrency}
                    options={[
                      ...new Set(
                        Object.values(COUNTRY_MAP).map((c) => c.currency)
                      ),
                    ].map((cur) => ({
                      value: cur,
                      label: cur,
                    }))}
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={
                    !name ||
                    !slug ||
                    !companySize ||
                    slugAvailable === false ||
                    !country
                  }
                  onClick={submit}
                  className="mt-4 w-full rounded-lg bg-primary py-2 text-sm text-white disabled:opacity-50"
                >
                  Create tenant
                </motion.button>
              </div>
            </motion.div>
          )}

          {screen === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl bg-background p-10 shadow-sm text-center"
            >
              <h2 className="text-lg font-semibold">Welcome to {name}</h2>
              <p className="mt-2 text-sm text-slate-500">
                Setting things up for you…
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
