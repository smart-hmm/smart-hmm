"use client";

import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  helperText?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  value?: string;
  values?: string[];
  onValueChange?: (value: string) => void;
  onValuesChange?: (values: string[]) => void;
  onChange?: (value: string | string[]) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  function SelectComponent(
    {
      label,
      helperText,
      error,
      options,
      placeholder = "Select an option",
      searchable = true,
      multiple = true,
      value,
      values,
      onValueChange,
      onValuesChange,
      onChange,
      onBlur,
      name,
      disabled = false,
      required = false,
      className = "",
    },
    ref
  ) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedValue, setSelectedValue] = useState<string>(value ?? "");
    const [selectedValues, setSelectedValues] = useState<string[]>(
      values ?? []
    );
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    useEffect(() => {
      if (values !== undefined) {
        setSelectedValues(values);
      }
    }, [values]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          if (open) {
            setOpen(false);
            setSearch("");
            onBlur?.();
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onBlur]);

    const filteredOptions = useMemo(() => {
      if (!search.trim()) return options;
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(search.trim().toLowerCase())
      );
    }, [options, search]);

    const toggleOpen = () => {
      if (disabled) return;
      setOpen((prev) => {
        const next = !prev;
        if (prev && !next) {
          onBlur?.();
        }
        return next;
      });
    };

    const clearSearch = () => setSearch("");

    const handleSelect = (option: Option) => {
      if (multiple) {
        const exists = selectedValues.includes(option.value);
        const next = exists
          ? selectedValues.filter((v) => v !== option.value)
          : [...selectedValues, option.value];

        setSelectedValues(next);
        onValuesChange?.(next);
        onChange?.(next);
        // also emit single value change for compatibility when only one selected
        if (!exists && next.length === 1) {
          onValueChange?.(option.value);
        }
        if (exists && next.length === 1) {
          onValueChange?.(next[0]);
        }
      } else {
        setSelectedValue(option.value);
        onValueChange?.(option.value);
        onChange?.(option.value);
        setOpen(false);
        onBlur?.();
      }
    };

    const removeValue = (val: string) => {
      const next = selectedValues.filter((v) => v !== val);
      setSelectedValues(next);
      onValuesChange?.(next);
      onChange?.(next);
      if (next.length === 1) {
        onValueChange?.(next[0]);
      }
    };

    const selectedLabels = useMemo(() => {
      const map = new Map(options.map((o) => [o.value, o.label]));
      if (multiple) {
        return selectedValues.map((v) => map.get(v) || v);
      }
      return selectedValue ? [map.get(selectedValue) || selectedValue] : [];
    }, [multiple, options, selectedValue, selectedValues]);

    const baseControl =
      "flex min-h-[42px] w-full items-start gap-2 rounded-xl border px-3 py-2 text-sm transition focus-within:ring-2";
    const controlState = [
      error
        ? "border-[var(--color-danger)] ring-[var(--color-danger)]/20"
        : open
        ? "border-[color:var(--theme-primary)] ring-[color:var(--theme-primary)]/20"
        : "border-muted hover:border-[color:var(--theme-primary)]/60",
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="relative space-y-1 text-sm" ref={containerRef}>
        {label && (
          <label className="block text-xs font-semibold text-foreground">
            {label}
            {required && <span className="text-[var(--color-danger)]"> *</span>}
          </label>
        )}

        <div className={`${baseControl} ${controlState}`} onClick={toggleOpen}>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {multiple && selectedValues.length > 0 ? (
              selectedValues.map((val) => {
                const labelText =
                  options.find((o) => o.value === val)?.label ?? val;
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--theme-primary),transparent_90%)] px-3 py-1 text-xs font-semibold text-foreground border border-[color:var(--theme-primary)]/30"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {labelText}
                    <button
                      type="button"
                      className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeValue(val);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })
            ) : selectedLabels.length > 0 ? (
              <span className="text-sm font-semibold text-foreground">
                {selectedLabels[0]}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                {placeholder}
              </span>
            )}
          </div>

          <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        </div>

        {(helperText || error) && (
          <p
            className={`text-[11px] ${
              error ? "text-[var(--color-danger)]" : "text-muted-foreground"
            }`}
          >
            {error ?? helperText}
          </p>
        )}

        {/* Hidden input for form libraries */}
        <input
          type="hidden"
          name={name}
          value={multiple ? selectedValues.join(",") : selectedValue}
          ref={ref}
          readOnly
        />

        {open && (
          <>
            <div
              className="absolute z-40 mt-2 w-full rounded-xl border border-muted bg-white shadow-xl"
              style={{ animation: "selectDropdownFade 140ms ease-out" }}
            >
              {searchable && (
                <div className="flex items-center gap-2 border-b border-muted px-3 py-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm text-foreground outline-none"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  {search && (
                    <button
                      type="button"
                      className="text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSearch();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              <div className="max-h-56 overflow-y-auto py-1">
                {filteredOptions.map((opt) => {
                  const isSelected = multiple
                    ? selectedValues.includes(opt.value)
                    : selectedValue === opt.value;

                  return (
                    <button
                      type="button"
                      key={opt.value}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition ${
                        isSelected
                          ? "bg-[color-mix(in_srgb,var(--theme-primary),transparent_92%)]"
                          : "hover:bg-muted/40"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(opt);
                      }}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded border ${
                          isSelected
                            ? "border-[color:var(--theme-primary)] bg-[color:var(--theme-primary)] text-white"
                            : "border-muted bg-white"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <span className="text-sm text-foreground">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}

                {filteredOptions.length === 0 && (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                    No options found
                  </div>
                )}
              </div>
            </div>
            <style jsx>{`
              @keyframes selectDropdownFade {
                from {
                  opacity: 0;
                  transform: translateY(-6px) scale(0.98);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
            `}</style>
          </>
        )}
      </div>
    );
  }
);
