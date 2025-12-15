"use client";

import Table from "@/components/ui/table/table";
import type { EmployeeInfo } from "@/types";
import { DateTime } from "luxon";
import Link from "next/link";

export default function Employees({
  employees,
}: {
  employees: EmployeeInfo[];
}) {
  return (
    <div className="rounded-xl w-full relative">
      <Table
        columns={[
          {
            label: "Name",
            mapToField: "firstName",
            render: (_, row) => {
              return (
                <Link
                  href={`/employees/${row.id}`}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  {row.firstName}, {row.lastName}
                </Link>
              );
            },
          },
          {
            label: "Code",
            mapToField: "code",
          },
          {
            label: "Email",
            mapToField: "email",
          },
          {
            label: "Position",
            mapToField: "position",
          },
          {
            label: "Phone",
            mapToField: "phone",
          },
          {
            label: "Join Date",
            mapToField: "joinDate",
            render: (val) => {
              if (!val) return "-";
              return DateTime.fromISO(String(val)).toFormat("dd/MM/yyyy");
            },
          },
        ]}
        data={employees ?? []}
      />
    </div>
  );
}
