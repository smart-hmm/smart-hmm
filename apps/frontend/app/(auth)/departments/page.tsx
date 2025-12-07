"use client";

import { useState } from "react";
import { Td, Th } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRBAC } from "@/components/providers/rbac-provider";
import useDepartments from "@/services/react-query/queries/use-departments";
import { DateTime } from "luxon";
import CreateDepartmentModal from "./components/create-deparment-modal";
import useEmployees from "@/services/react-query/queries/use-employees";
import Link from "next/link";

export default function DepartmentsPage() {
  const router = useRouter();
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees({});
  const { can } = useRBAC();
  const { data: departments, isLoading, error } = useDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
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
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-muted">
            <tr>
              <Th>Name</Th>
              {/* <Th>Branch</Th> */}
              <Th>Manager</Th>
              <Th>Total Employees</Th>
              <Th>Created At</Th>
            </tr>
          </thead>

          <tbody>
            {!departments || departments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-sm text-foreground/60"
                >
                  No departments yet. Click{" "}
                  <span className="font-semibold">“Create New Department”</span>{" "}
                  to add one.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-t border-muted hover:bg-surface"
                >
                  <Td className="font-semibold">
                    <Link
                      href={`/departments/${dept.id}`}
                      className="hover:underline cursor-pointer"
                    >
                      {dept.name}
                    </Link>
                  </Td>
                  {/* <Td>Ho Chi Minh</Td> */}
                  <Td>
                    <Link
                      className="text-info hover:underline"
                      href={"/"}
                    >{`${dept.manager?.firstName}, ${dept.manager?.lastName}`}</Link>
                  </Td>
                  <Td>
                    <span className="font-semibold text-[color:var(--theme-primary)]">
                      {dept.totalEmployees ?? "-"}
                    </span>
                  </Td>
                  <Td>
                    {DateTime.fromISO(dept.createdAt).toFormat("dd/MM/yyyy")}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <CreateDepartmentModal
          isLoadingEmployees={isLoadingEmployees}
          employees={employees}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}
