"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRBAC } from "@/components/providers/rbac-provider";
import useDepartments from "@/services/react-query/queries/use-departments";
import { DateTime } from "luxon";
import CreateDepartmentModal from "./components/create-deparment-modal";
import useEmployees from "@/services/react-query/queries/use-employees";
import Table from "@/components/ui/table/table";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/services/redux/store";

export default function DepartmentsClient() {
  const router = useRouter();
  const { data: employeesList, isLoading: isLoadingEmployees } = useEmployees(
    {}
  );
  const { can } = useRBAC();
  const { data: departments, isLoading, error } = useDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedTenant = useSelector((state:RootState) => state.tenants.selectedTenant)

  return (
    <div className="min-h-screentext-foreground p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-md hover:bg-muted"
          >
            <ArrowLeft className="w-6 h-6 text-[color:var(--theme-primary)]" />
          </button>

          <h1 className="text-xl font-bold text-[color:var(--theme-primary)]">
            Departments
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-[color:var(--theme-primary)] text-white text-sm font-semibold hover:opacity-90"
        >
          + Create New Department
        </button>
      </div>

      <div className="bg-background border border-muted rounded-xl overflow-hidden">
        <Table
          sortMode="client"
          columns={[
            {
              label: "Name",
              mapToField: "name",
              sortable: true,
              render: (value, row) =>
                value ? (
                  <Link
                    className="font-bold text-primary hover:underline cursor-pointer"
                    href={`/${selectedTenant?.workspaceSlug}/departments/${row.id}`}
                  >
                    {String(value)}
                  </Link>
                ) : (
                  "-"
                ),
            },
            {
              label: "Manager",
              render: (_, row) => (
                <p>
                  {row.manager ? (
                    <Link
                      className="font-bold text-primary hover:underline cursor-pointer"
                      href={`/employees/${row.manager.id}`}
                    >
                      {row.manager.firstName}, {row.manager.lastName}
                    </Link>
                  ) : (
                    "-"
                  )}
                </p>
              ),
            },
            {
              label: "Total Employees",
              mapToField: "totalEmployees",
              sortable: true,
              render: (value) => <p>{value ? String(value) : "-"}</p>,
            },
            {
              label: "Created At",
              mapToField: "createdAt",
              sortable: true,
              render: (value) => (
                <p>
                  {value
                    ? DateTime.fromISO(String(value)).toFormat("dd/MM/yyyy")
                    : "-"}
                </p>
              ),
            },
          ]}
          data={departments ?? []}
        />
      </div>
      {isModalOpen && (
        <CreateDepartmentModal
          isLoadingEmployees={isLoadingEmployees}
          employees={employeesList?.items}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}
