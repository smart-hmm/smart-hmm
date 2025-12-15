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

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: SortDirection;
}) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-4 w-4 items-center justify-center ${active ? "text-primary" : "text-muted-foreground"}`}
    >
      <svg
        viewBox="0 0 12 12"
        className="h-3 w-3"
        style={{ transform: direction === "asc" ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        <path
          d="M6 8 2.5 4.5h7L6 8Z"
          className={`${active ? "fill-current" : "fill-current opacity-60"}`}
        />
      </svg>
    </span>
  );
}

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

  const goToPage = (next: number) => {
    const nextPage = Math.min(Math.max(next, 1), totalPages);
    setInternalPage(nextPage);
    onPageChange?.(nextPage);
  };

  const renderPageNumbers = () => {
    const pages: number[] = [];
    const windowSize = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - windowSize && i <= page + windowSize)
      ) {
        pages.push(i);
      }
    }

    const result: (number | string)[] = [];
    pages.forEach((p, idx) => {
      result.push(p);
      if (idx < pages.length - 1 && pages[idx + 1] - p > 1) {
        result.push("...");
      }
    });

    return result;
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-muted bg-white py-12 text-center text-sm text-foreground shadow-sm">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-muted/60 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted/60">
            <tr className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {columns.map((col) => {
                const isSorted = sortKey === col.mapToField;
                return (
                  <th
                    key={String(col.mapToField)}
                    className="px-4 py-3 text-left md:px-5"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        col.sortable && col.mapToField && onSort(col.mapToField)
                      }
                      className={`group inline-flex items-center gap-2 rounded-full px-2 py-1 transition ${col.sortable
                        ? "cursor-pointer hover:bg-white"
                        : "cursor-default"
                        }`}
                    >
                      <span>{col.label}</span>
                      {col.sortable && (
                        <SortIndicator
                          active={isSorted}
                          direction={isSorted ? sortDir : "asc"}
                        />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/60 text-sm text-foreground">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-white transition hover:bg-[color-mix(in_srgb,var(--color-primary),transparent_95%)]"
              >
                {columns.map((col) => {
                  const rawValue = col.mapToField ? row[col.mapToField] : "";
                  const tooltip =
                    typeof rawValue === "string" || typeof rawValue === "number"
                      ? String(rawValue)
                      : undefined;

                  return (
                    <td
                      key={String(col.mapToField)}
                      className="px-4 py-4 align-middle md:px-5"
                    >
                      <HoverTooltip content={tooltip}>
                        <div className="min-w-0 truncate text-[13px] font-medium text-foreground">
                          {col.render
                            ? col.render(rawValue, row)
                            : String(rawValue ?? "")}
                        </div>
                      </HoverTooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-muted/60 bg-white px-4 py-4 text-sm text-muted-foreground md:px-6">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-muted text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          {"<"}
        </button>

        <div className="flex items-center gap-2 text-foreground">
          {renderPageNumbers().map((item, idx) =>
            typeof item === "number" ? (
              <button
                key={`${item}-${idx}`}
                type="button"
                onClick={() => goToPage(item)}
                className={`h-9 min-w-[36px] rounded-lg border px-3 text-sm font-semibold transition ${item === page
                  ? "border-primary/40 bg-[color-mix(in_srgb,var(--color-primary),transparent_88%)] text-foreground shadow-sm"
                  : "border-transparent hover:border-muted hover:bg-muted"
                  }`}
              >
                {item}
              </button>
            ) : (
              <span key={`ellipsis-${idx}`} className="px-2 text-base">
                {item}
              </span>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-muted text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
