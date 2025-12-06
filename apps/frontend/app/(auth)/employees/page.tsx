"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Td, Th } from "@/components/ui/table";
import useEmployees from "@/services/react-query/queries/use-employees";
import Link from "next/link";

const employeeSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  position: z.string().min(2, "Position is required"),
  department: z.string().min(2, "Department is required"),
  role: z.string().min(2, "Role is required"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface Employee extends EmployeeFormValues {
  id: string;
  createdAt: string;
  status: "Active" | "Inactive";
}

const DEPARTMENTS = ["Human Resources", "Product", "Engineering", "Design"];

export default function EmployeesPage() {
  const router = useRouter();
  const { data: employees, isLoading: isLoadingEmployees } = useEmployees();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(employees ? employees.length / pageSize : 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  const handleCreate = (values: EmployeeFormValues) => {
    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      fullName: values.fullName,
      email: values.email,
      position: values.position,
      department: values.department,
      role: values.role,
      status: "Active",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    reset();
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-md hover:bg-[var(--color-muted)]"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--color-primary)]" />
          </button>

          <h1 className="text-xl font-bold text-[var(--color-primary)]">
            Employees
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90"
        >
          + Create New Employee
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by employee name..."
          className="w-full bg-surface md:w-[300px] rounded-md border border-muted px-3 py-2 text-sm"
        />

        <select
          value={departmentFilter}
          onChange={(e) => {
            setDepartmentFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-[300px] rounded-md border border-muted px-3 py-2 text-sm bg-surface"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-background border border-[var(--color-muted)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface)] border-b border-[var(--color-muted)]">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Department</Th>
              <Th>Position</Th>
              <Th>Status</Th>
              <Th>Created</Th>
            </tr>
          </thead>

          <tbody>
            {!employees || employees.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-6 text-center text-sm text-[var(--color-foreground)]/60"
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t border-[var(--color-muted)] hover:bg-[var(--color-surface)]"
                >
                  <Td className="font-semibold">
                    {emp.firstName} {emp.lastName}
                  </Td>
                  <Td>{emp.email}</Td>
                  <Td>
                    {emp.departmentName ? (
                      <Link href={`/departments/${emp.departmentID}`}>
                        {emp.departmentName}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </Td>
                  <Td>{emp.position}</Td>
                  <Td>
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-success)]/20 text-[var(--color-success)]">
                      Active
                    </span>
                  </Td>
                  <Td>{emp.createdAt}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-[var(--color-foreground)]/60">
          Page {currentPage} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === i + 1
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= CREATE MODAL (UNCHANGED FROM YOUR LAST STEP) ================= */}
      {/* ================= CREATE MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-background rounded-xl shadow-lg border border-[var(--color-muted)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">Create New Employee</h2>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                }}
                className="text-sm text-[var(--color-foreground)]/60 hover:text-[var(--color-danger)]"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit(handleCreate)}
              className="space-y-4 text-sm"
            >
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2"
                  placeholder="e.g. Nguyen Van A"
                />
                {errors.fullName && (
                  <p className="text-xs text-[var(--color-danger)]">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Work Email
                </label>
                <input
                  {...register("email")}
                  className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2"
                  placeholder="e.g. vana@company.com"
                />
                {errors.email && (
                  <p className="text-xs text-[var(--color-danger)]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Job Position
                </label>
                <input
                  {...register("position")}
                  className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2"
                  placeholder="e.g. Frontend Developer"
                />
                {errors.position && (
                  <p className="text-xs text-[var(--color-danger)]">
                    {errors.position.message}
                  </p>
                )}
              </div>

              {/* Department (SELECT) ✅ */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Department
                </label>
                <select
                  {...register("department")}
                  className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2 bg-background"
                >
                  <option value="">Select department</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Product">Product</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                </select>
                {errors.department && (
                  <p className="text-xs text-[var(--color-danger)]">
                    {errors.department.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  System Role
                </label>
                <select
                  {...register("role")}
                  className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2 bg-background"
                >
                  <option value="">Select role</option>
                  <option value="HR">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
                {errors.role && (
                  <p className="text-xs text-[var(--color-danger)]">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="px-4 py-2 rounded-md border border-[var(--color-muted)]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-md bg-[var(--color-primary)] text-white font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
