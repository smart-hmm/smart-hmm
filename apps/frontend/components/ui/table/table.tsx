"use client";

import React, { useMemo, useState } from "react";

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
      <div className="w-full rounded-xl border border-muted bg-surface py-12 text-center text-sm text-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-muted bg-surface">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-muted">
            {columns.map((col) => (
              <th
                key={String(col.mapToField)}
                onClick={() =>
                  col.sortable && col.mapToField && onSort(col.mapToField)
                }
                className={`
                  px-4 py-3 text-left font-semibold text-foreground
                  ${col.sortable ? "cursor-pointer select-none" : ""}
                `}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortKey === col.mapToField && (
                    <span className="text-xs text-primary">
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-t border-muted hover:bg-[color-mix(in_srgb,var(--color-primary),transparent_92%)] transition"
            >
              {columns.map((col) => {
                const rawValue = col.mapToField ? row[col.mapToField] : "";

                return (
                  <td
                    key={String(col.mapToField)}
                    className="px-4 py-3 text-foreground whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(rawValue, row)
                      : String(rawValue ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-4 py-3 border-t border-muted text-sm">
        <span className="text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => {
              setInternalPage((p) => Math.max(1, p - 1));
              onPageChange?.(page - 1);
            }}
            className="px-4 py-2 rounded-md bg-primary text-surface 
            cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => {
              setInternalPage((p) => Math.min(totalPages, p + 1));
              onPageChange?.(page + 1);
            }}
            className="px-4 py-2 rounded-md bg-primary text-surface
            disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
