"use client";

import { useEffect, useMemo, useState } from "react";
import Table from "@/components/ui/table/table";
import type { EmployeeInfo } from "@/types";
import { DateTime } from "luxon";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

export default function Employees({
  employees,
  totalCount,
}: {
  employees: EmployeeInfo[];
  totalCount: number;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [employees.length]);

  const typeLabel: Record<EmployeeInfo["employmentType"], string> = {
    FULL_TIME: "Full time",
    PART_TIME: "Part time",
    CONTRACT: "Contract",
  };

  const statusBadge: Record<
    EmployeeInfo["employmentStatus"],
    { label: string; className: string }
  > = {
    ACTIVE: {
      label: "Active",
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    },
    INACTIVE: {
      label: "Inactive",
      className: "bg-amber-50 text-amber-700 border border-amber-200/80",
    },
    SUSPENDED: {
      label: "Suspended",
      className: "bg-rose-50 text-rose-700 border border-rose-200/80",
    },
  };

  const initials = (first: string, last: string) =>
    `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

  const rowRange = useMemo(() => {
    if (employees.length === 0) return { start: 0, end: 0 };
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, employees.length);
    return { start, end };
  }, [employees.length, page]);

  return (
    <div className="relative w-full space-y-3 rounded-xl">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {rowRange.start} to {rowRange.end} of {totalCount} results
        </span>
        <span>Sorted by name</span>
      </div>

      <Table
        pageSize={pageSize}
        currentPage={page}
        onPageChange={setPage}
        columns={[
          {
            label: "Employee ID",
            mapToField: "code",
            render: (value, row) => (
              <span className="text-sm font-semibold text-foreground">
                #{value || row.id?.slice(0, 6)}
              </span>
            ),
          },
          {
            label: "Employee Name",
            mapToField: "firstName",
            render: (_, row) => (
              <Link
                href={`/employees/${row.id}`}
                className="flex items-center gap-3 text-sm text-foreground transition hover:text-[color:var(--theme-primary)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/80 via-sky-500/80 to-cyan-500/70 text-sm font-semibold text-white shadow-sm">
                  {initials(row.firstName, row.lastName)}
                </span>
                <span className="flex flex-col">
                  <span className="font-semibold">
                    {row.firstName} {row.lastName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {row.position}
                  </span>
                </span>
              </Link>
            ),
          },
          {
            label: "Type",
            mapToField: "employmentType",
            render: (val) => (
              <span className="text-sm font-medium text-foreground">
                {val ? typeLabel[val as EmployeeInfo["employmentType"]] : "-"}
              </span>
            ),
          },
          {
            label: "Joined",
            mapToField: "joinDate",
            render: (val) =>
              val ? (
                <span className="text-sm font-medium text-foreground">
                  {DateTime.fromISO(String(val)).toFormat("dd MMM yyyy")}
                </span>
              ) : (
                "-"
              ),
          },
          {
            label: "Phone",
            mapToField: "phone",
          },
          {
            label: "Status",
            mapToField: "employmentStatus",
            render: (val) => {
              if (!val) return "-";
              const badge = statusBadge[val as EmployeeInfo["employmentStatus"]];
              return (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                >
                  {badge.label}
                </span>
              );
            },
          },
          {
            label: "Actions",
            render: () => (
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-muted/70 text-muted-foreground transition hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            ),
          },
        ]}
        data={employees ?? []}
      />
    </div>
  );
}
