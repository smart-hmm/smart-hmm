"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import useEmployees from "@/services/react-query/queries/use-employees";
import Link from "next/link";
import useDepartments from "@/services/react-query/queries/use-departments";
import { DateTime } from "luxon";
import useDebounce from "@/hooks/use-debounce";
import { SearchInput } from "@/components/ui/search-input";
import Table from "@/components/ui/table/table";
import { Select } from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/services/redux/store";

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

export default function EmployeesClient() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const { debounce } = useDebounce();
  const [departmentsFilter, setDepartmentsFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1;
  const selectedTenant = useSelector(
    (state: RootState) => state.tenants.selectedTenant
  );

  const { data: employeeList } = useEmployees({
    tenantId: selectedTenant?.id,
    email: debounceSearch,
    name: debounceSearch,
    code: debounceSearch,
    departmentIds: departmentsFilter,
    page: currentPage,
    limit: pageSize,
  });
  const { data: departments } = useDepartments();
  const totalItems = employeeList?.pagination.totalItems ?? 0;

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

  useEffect(() => {
    debounce(() => {
      setDebounceSearch(search);
    }, 250);
  }, [search, debounce]);

  return (
    <div className="min-h-screentext-foreground p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
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
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90"
        >
          + Create New Employee
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput
          placeHolder="Search by name, email or code"
          search={search}
          setSearch={(value) => setSearch(value)}
        />

        <Select
          values={departmentsFilter}
          onValuesChange={(values) => {
            setCurrentPage(1);
            setDepartmentsFilter(values);
          }}
          className="w-full md:w-[300px]"
          options={[
            ...(departments
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((dept) => ({
                value: dept.id,
                label: dept.name,
              })) ?? []),
          ]}
        />
      </div>

      <div className="bg-background border border-[var(--color-muted)] rounded-xl overflow-hidden">
        <Table
          paginationMode="server"
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
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
              label: "Department",
              render: (_, row) => {
                if (!row.departmentID) return "-";
                return (
                  <Link
                    href={`/departments/${row.departmentID}`}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    {row.departmentName}
                  </Link>
                );
              },
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
          data={employeeList ? employeeList.items : []}
        />
      </div>

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
                <div className="block text-xs font-semibold mb-1">
                  Full Name
                </div>
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
                <div className="block text-xs font-semibold mb-1">
                  Work Email
                </div>
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
                <div className="block text-xs font-semibold mb-1">
                  Job Position
                </div>
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
                <Select
                  label="Department"
                  options={[
                    { value: "Human Resources", label: "Human Resources" },
                    { value: "Product", label: "Product" },
                    { value: "Engineering", label: "Engineering" },
                    { value: "Design", label: "Design" },
                  ]}
                  error={errors.department?.message}
                  className="bg-background"
                />
              </div>

              {/* Role */}
              <div>
                <Select
                  label="System Role"
                  onChange={(e) => {}}
                  options={[
                    { value: "HR", label: "HR" },
                    { value: "Manager", label: "Manager" },
                    { value: "Employee", label: "Employee" },
                  ]}
                  error={errors.role?.message}
                  className="bg-background"
                />
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
