"use client";

import { Check, ChevronsUpDown, Minus, Search, X } from "lucide-react";
import {
  type MouseEvent as ReactMouseEvent,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
    const selectedValues = useMemo(() => {
      if (!values) return [];
      return values;
    }, [values]);
    const selectedValue = useMemo(() => {
      if (!value) return "";
      return value;
    }, [value]);
    const containerRef = useRef<HTMLDivElement | null>(null);

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

    const orderedOptions = useMemo(() => {
      if (!multiple) return filteredOptions;
      const selectedSet = new Set(selectedValues);
      const selectedList = filteredOptions.filter((opt) =>
        selectedSet.has(opt.value)
      );
      const unselectedList = filteredOptions.filter(
        (opt) => !selectedSet.has(opt.value)
      );
      return [...selectedList, ...unselectedList];
    }, [filteredOptions, multiple, selectedValues]);

    const selectedCount = multiple
      ? selectedValues.length
      : selectedValue
      ? 1
      : 0;
    const allSelected =
      multiple &&
      options.length > 0 &&
      selectedValues.length === options.length;
    const partiallySelected =
      multiple && selectedValues.length > 0 && !allSelected;

    const toggleOpen = () => {
      if (disabled) return;
      setOpen((prev) => {
        const next = !prev;
        if (prev && !next) {
          setSearch("");
          onBlur?.();
        }
        return next;
      });
    };

    const clearSearch = () => setSearch("");

    const handleSelect = (option: Option) => {
      if (disabled) return;
      if (multiple) {
        const exists = selectedValues.includes(option.value);
        const next = exists
          ? selectedValues.filter((v) => v !== option.value)
          : [...selectedValues, option.value];

        onValuesChange?.(next);
        onChange?.(next);
        // also emit single value change for compatibility when only one selected
        if (!exists && next.length === 1) {
          onValueChange?.(option.value);
        }
        if (exists && next.length === 1) {
          onValueChange?.(next[0]);
        }
        if (next.length === 0) {
          onValueChange?.("");
        }
      } else {
        onValueChange?.(option.value);
        onChange?.(option.value);
        setOpen(false);
        setSearch("");
        onBlur?.();
      }
    };

    const toggleAll = () => {
      if (!multiple || disabled) return;
      const next = allSelected ? [] : options.map((opt) => opt.value);
      onValuesChange?.(next);
      onChange?.(next);
      if (next.length === 1) {
        onValueChange?.(next[0]);
      }
      if (next.length === 0) {
        onValueChange?.("");
      }
    };

    const clearAll = (e?: ReactMouseEvent) => {
      e?.stopPropagation();
      if (!multiple || disabled) return;
      onValuesChange?.([]);
      onChange?.([]);
      onValueChange?.("");
    };

    const removeValue = (val: string) => {
      const next = selectedValues.filter((v) => v !== val);
      onValuesChange?.(next);
      onChange?.(next);
      if (next.length === 1) {
        onValueChange?.(next[0]);
      }
      if (next.length === 0) {
        onValueChange?.("");
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
      "flex min-h-[44px] w-full items-center gap-2 rounded-[12px] border px-3 py-2 text-sm transition focus-within:ring-2";
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
          <div className="flex flex-1 items-center gap-2 truncate">
            {multiple ? (
              <span
                className={`truncate text-sm ${
                  selectedCount > 0
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {placeholder}
              </span>
            ) : selectedLabels.length > 0 ? (
              <span className="truncate text-sm font-semibold text-foreground">
                {selectedLabels[0]}
              </span>
            ) : (
              <span className="truncate text-sm text-muted-foreground">
                {placeholder}
              </span>
            )}
          </div>

          {multiple && selectedCount > 0 && (
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 rounded-full bg-foreground px-2 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-foreground/90"
                onClick={(e) => clearAll(e)}
              >
                <span>{selectedCount}</span>
                <X className="h-3 w-3" />
              </button>
              <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden min-w-[180px] max-h-60 overflow-y-auto rounded-lg border border-muted bg-white px-3 py-2 text-xs text-foreground shadow-lg group-hover:block">
                {selectedLabels.map((labelText, idx) => (
                  <div key={`${labelText}-${idx}`} className="py-1">
                    {labelText}
                  </div>
                ))}
              </div>
            </div>
          )}

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
              className="absolute z-40 mt-2 w-full rounded-2xl border border-muted bg-white shadow-xl"
              style={{ animation: "selectDropdownFade 140ms ease-out" }}
            >
              {searchable && (
                <div className="flex items-center gap-2 border-b border-muted px-3 py-3">
                  <div className="flex flex-1 items-center gap-2 rounded-[10px] bg-[var(--surface-soft,#f7f7f8)] px-3 py-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={placeholder || "Search..."}
                      className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                    {search && (
                      <button
                        type="button"
                        className="text-muted-foreground transition hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSearch();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {multiple && selectedCount > 0 && (
                    <div className="relative group">
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-foreground/90"
                        onClick={(e) => clearAll(e)}
                      >
                        <span>{selectedCount}</span>
                        <X className="h-3 w-3" />
                      </button>
                      <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 hidden min-w-[180px] max-h-60 overflow-y-auto rounded-lg border border-muted bg-white px-3 py-2 text-xs text-foreground shadow-lg group-hover:block">
                        {selectedLabels.map((labelText, idx) => (
                          <div key={`${labelText}-${idx}`} className="py-1">
                            {labelText}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="max-h-60 overflow-y-auto py-1">
                {multiple && options.length > 0 && (
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition ${
                      allSelected || partiallySelected
                        ? "bg-[color-mix(in_srgb,var(--theme-primary),transparent_92%)]"
                        : "hover:bg-muted/40"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAll();
                    }}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        allSelected || partiallySelected
                          ? "border-[color:var(--theme-primary)] bg-[color:var(--theme-primary)] text-white"
                          : "border-muted bg-white"
                      }`}
                    >
                      {allSelected ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : partiallySelected ? (
                        <Minus className="h-3.5 w-3.5" />
                      ) : null}
                    </span>
                    <span className="text-sm text-foreground">Select All</span>
                  </button>
                )}

                {orderedOptions.map((opt) => {
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

                {orderedOptions.length === 0 && (
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
