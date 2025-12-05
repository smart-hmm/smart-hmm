"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Td, Th } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* =======================
   TYPES & SCHEMA
======================= */

const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  code: z.string().min(2, "Code must be at least 2 characters").max(20),
  manager: z
    .string()
    .min(2, "Manager name must be at least 2 characters")
    .max(100),
  description: z
    .string()
    .max(300, "Description must be at most 300 characters")
    .optional(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface Department extends DepartmentFormValues {
  id: string;
  createdAt: string;
  totalEmployees: number; // ✅ NEW FIELD
}

/* =======================
   MAIN PAGE
======================= */

export default function DepartmentsPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Human Resources",
      code: "HR",
      manager: "Nguyen Van A",
      description: "Handles recruitment, onboarding, and employee relations.",
      createdAt: "2025-12-01",
      totalEmployees: 12,
    },
    {
      id: "2",
      name: "Product",
      code: "PROD",
      manager: "Tran Thi B",
      description: "Responsible for product strategy and delivery.",
      createdAt: "2025-12-02",
      totalEmployees: 25,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      code: "",
      manager: "",
      description: "",
    },
  });

  const handleCreate = (values: DepartmentFormValues) => {
    const newDepartment: Department = {
      id: crypto.randomUUID(),
      name: values.name,
      code: values.code.toUpperCase(),
      manager: values.manager,
      description: values.description,
      createdAt: new Date().toISOString().slice(0, 10),
      totalEmployees: 0, // ✅ DEFAULT
    };

    setDepartments((prev) => [newDepartment, ...prev]);
    reset();
    setIsModalOpen(false);
  };

  const onSubmit = (values: DepartmentFormValues) => {
    handleCreate(values);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-md hover:bg-[var(--color-muted)]"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--color-primary)]" />
          </button>

          <h1 className="text-xl font-bold text-[var(--color-primary)]">
            Departments
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90"
        >
          + Create New Department
        </button>
      </div>

      <div className="bg-background border border-[var(--color-muted)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface)] border-b border-[var(--color-muted)]">
            <tr>
              <Th>Name</Th>
              <Th>Code</Th>
              <Th>Branch</Th>
              <Th>Manager</Th>
              <Th>Total Employees</Th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-6 text-center text-sm text-[var(--color-foreground)]/60"
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
                  className="border-t border-[var(--color-muted)] hover:bg-[var(--color-surface)]"
                >
                  <Td className="font-semibold">{dept.name}</Td>
                  <Td>{dept.code}</Td>
                  <Td>Ho Chi Minh</Td>
                  <Td>{dept.manager}</Td>
                  <Td>
                    <span className="font-semibold text-[var(--color-primary)]">
                      {dept.totalEmployees}
                    </span>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= CREATE MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-[var(--color-muted)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">Create Department</h2>
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
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 text-sm"
            >
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2"
                  placeholder="e.g. Human Resources"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-[var(--color-danger)]">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Code & Manager */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    {...register("code")}
                    className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2 uppercase"
                    placeholder="e.g. HR"
                  />
                  {errors.code && (
                    <p className="mt-1 text-xs text-[var(--color-danger)]">
                      {errors.code.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Manager
                  </label>
                  <input
                    type="text"
                    {...register("manager")}
                    className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2"
                    placeholder="e.g. Nguyen Van A"
                  />
                  {errors.manager && (
                    <p className="mt-1 text-xs text-[var(--color-danger)]">
                      {errors.manager.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  {...register("description")}
                  className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2 resize-none"
                  placeholder="Short description of this department..."
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-[var(--color-danger)]">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-md bg-[var(--color-primary)] text-white font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
