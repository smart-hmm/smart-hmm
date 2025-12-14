"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Flags from "country-flag-icons/react/3x2";
import useOnboarding from "@/services/react-query/mutations/use-onboarding";
import { useRouter } from "next/navigation";
import useTenantMetadata from "@/services/react-query/queries/use-tenant-metadata";
import Loading from "@/app/loading";

const DEFAULT_VISIBLE = 9;

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
      <div className="absolute inset-0 bg-black/40"
        onKeyDown={() => { }}
        onClick={onClose} />

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
            type='button'
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
              type='button'
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
  const router = useRouter()
  const [screen, setScreen] = useState<"intro" | "form" | "success">("intro");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [industry, setIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [companySize, setCompanySize] = useState<string>("");
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
  const { data: metadata, isLoading: isLoadingMetadata } = useTenantMetadata()

  const [expanded, setExpanded] = useState(false);
  const visibleIndustries = useMemo(() => {
    if (expanded) return metadata?.industries;
    return metadata?.industries.slice(0, DEFAULT_VISIBLE);
  }, [expanded, metadata]);

  const { mutateAsync: onboarding, isPending: isPendingOnboarding } =
    useOnboarding();

  const countryConfig = metadata?.countries ? (metadata.countries.find(ele => ele.code === country) || null) : null;

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
    } catch { }
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

    const cfg = metadata?.countries ? (metadata.countries.find(ele => ele.code === country) || null) : null;
    if (!cfg) return;
    if (!timezone) setTimezone(cfg.defaultTimezone);
    if (!currency) setCurrency(cfg.currency);
  }, [country, timezone, currency, metadata]);

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
        window.location.href = "/select-tenant"
      }, 2000);
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

  if (isLoadingMetadata) return <Loading />

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
                  <div className="block text-sm font-medium">
                    Tenant name
                  </div>
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
                    }}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <div className="block text-sm font-medium">
                    Tenant URL
                  </div>
                  <p className="mb-1 text-xs text-slate-500">
                    This will be your workspace address.
                  </p>

                  <div
                    className={`flex items-center rounded-lg border px-3 py-2
                      ${slugAvailable === false
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
                  <div className="flex items-center justify-between">
                    <div className="block text-sm font-medium">Industry</div>

                    {industry && industry !== "Other" && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {industry}
                      </span>
                    )}
                  </div>

                  <p className="mb-2 text-xs text-slate-500">
                    Used to tailor defaults for your business.
                  </p>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {visibleIndustries?.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setIndustry(item.name)}
                        className={`rounded-lg border px-3 py-2 text-sm transition
          ${industry === item.name
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-muted hover:border-slate-300"
                          }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>

                  {/* Expand / Collapse */}
                  {metadata && metadata.industries.length > DEFAULT_VISIBLE && (
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      {expanded
                        ? "Show less"
                        : `Show ${metadata.industries.length - DEFAULT_VISIBLE} more`}
                    </button>
                  )}

                  {/* Custom input */}
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
                  <div className="block text-sm font-medium">
                    Company size
                  </div>
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
                        onClick={() => setCompanySize(o.key)}
                        className={`rounded-xl border p-4 text-left
                          ${companySize === o.key
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
                      country && metadata?.countries ? (metadata.countries.find(ele => ele.code === country) || undefined)?.label : undefined
                    }
                    onClick={() => setOpenCountry(true)}
                  />

                  {metadata?.countries && metadata.countries.length > 0 &&
                    <GridSelectModal
                      open={openCountry}
                      title="Select country"
                      value={country}
                      columns={3}
                      onClose={() => setOpenCountry(false)}
                      onSelect={(code) => {
                        const country = metadata?.countries.find(ele => ele.code === code)
                        if (!country) return;
                        setCountry(code);
                        setTimezone(country.defaultTimezone);
                        setCurrency(country.currency);
                      }}
                      options={metadata?.countries.map((c) => ({
                        value: c.code,
                        label: c.label,
                        Flag: Flags[c.code as keyof typeof Flags],
                      }))}
                    />}

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

                  {metadata?.countries && metadata.countries.length > 0 &&
                    <GridSelectModal
                      open={openCurrency}
                      title="Select currency"
                      value={currency}
                      columns={3}
                      onClose={() => setOpenCurrency(false)}
                      onSelect={setCurrency}
                      options={[
                        ...new Set(
                          metadata.countries.map((c) => c.currency)
                        ),
                      ].map((cur) => ({
                        value: cur,
                        label: cur,
                      }))}
                    />}
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
