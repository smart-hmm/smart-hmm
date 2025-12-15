"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ColumnData<T extends object> = {
  label: string;
  mapToField?: keyof T;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
};

type SortDirection = "asc" | "desc";
type SortMode = "client" | "server";
type PaginationMode = "client" | "server";

type TableProps<T extends object> = {
  data: T[];
  columns: ColumnData<T>[];
  emptyText?: string;
  sortMode?: SortMode;
  onSortChange?: (key: keyof T, direction: SortDirection) => void;

  paginationMode?: PaginationMode;
  pageSize?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

function HoverTooltip({
  content,
  children,
}: {
  content?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const hasContent = Boolean(content);

  const updatePosition = () => {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({
      top: rect.top - 22,
      left: rect.left + rect.width / 2,
    });
  };

  useEffect(() => {
    if (!open || !hasContent) return;

    updatePosition();
    const handle = () => updatePosition();
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [open, hasContent]);

  return (
    <span
      className="group relative inline-flex max-w-full"
      onMouseEnter={() => hasContent && setOpen(true)}
      onMouseLeave={() => hasContent && setOpen(false)}
      onFocus={() => hasContent && setOpen(true)}
      onBlur={() => hasContent && setOpen(false)}
      ref={anchorRef}
    >
      <span className="max-w-full truncate">{children}</span>
      {hasContent && open &&
        createPortal(
          <span
            role="tooltip"
            style={{ top: position.top, left: position.left }}
            className="pointer-events-none fixed z-40 max-w-xs -translate-x-1/2 whitespace-pre-line rounded-md bg-black px-2 py-1 text-xs font-medium text-white shadow-lg"
          >
            {content}
          </span>,
          document.body
        )}
    </span>
  );
}

export default function Table<T extends object>({
  data,
  columns,
  emptyText = "No data available",

  sortMode = "client",
  paginationMode = "client",

  pageSize = 10,
  totalItems,
  currentPage,
  onSortChange,
  onPageChange,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const [internalPage, setInternalPage] = useState(1);
  const page = currentPage ?? internalPage;

  const onSort = (key: keyof T) => {
    let nextDir: SortDirection = "asc";

    if (sortKey === key) {
      nextDir = sortDir === "asc" ? "desc" : "asc";
      setSortDir(nextDir);
    } else {
      setSortKey(key);
      setSortDir("asc");
      nextDir = "asc";
    }

    if (sortMode === "server") {
      onSortChange?.(key, nextDir);

      setInternalPage(1);
      onPageChange?.(1);
    }
  };

  const sortedData = useMemo(() => {
    if (sortMode === "server") return data;
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      return 0;
    });
  }, [data, sortKey, sortDir, sortMode]);

  const paginatedData = useMemo(() => {
    if (paginationMode === "server") return sortedData;

    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize, paginationMode]);

  const total =
    paginationMode === "server" ? totalItems ?? 0 : sortedData.length;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-muted bg-white py-12 text-center text-sm text-foreground shadow-sm">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-visible rounded-2xl border border-muted/50 bg-background shadow-sm">
      <div className="divide-y divide-muted/70">
        {paginatedData.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="px-4 py-4 transition hover:bg-[color-mix(in_srgb,var(--color-primary),transparent_94%)] md:px-6"
          >
            <div
              className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]"
              style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
            >
              {columns.map((col) => {
                const rawValue = col.mapToField ? row[col.mapToField] : "";
                const isSorted = sortKey === col.mapToField;
                const tooltip =
                  typeof rawValue === "string" || typeof rawValue === "number"
                    ? String(rawValue)
                    : undefined;

                return (
                  <button
                    type="button"
                    key={String(col.mapToField)}
                    onClick={() =>
                      col.sortable && col.mapToField && onSort(col.mapToField)
                    }
                    className={`group flex min-w-0 flex-col items-start text-left ${col.sortable ? "cursor-pointer" : "cursor-default"
                      }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {col.label}
                      {col.sortable && (
                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground">
                          {isSorted ? (sortDir === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 w-full text-[13px] font-normal text-foreground">
                      <HoverTooltip content={tooltip}>
                        {col.render
                          ? col.render(rawValue, row)
                          : String(rawValue ?? "")}
                      </HoverTooltip>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-muted px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
        <span className="text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => {
              setInternalPage((p) => Math.max(1, p - 1));
              onPageChange?.(page - 1);
            }}
            className="rounded-full border border-muted px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => {
              setInternalPage((p) => Math.min(totalPages, p + 1));
              onPageChange?.(page + 1);
            }}
            className="rounded-full border border-muted px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
