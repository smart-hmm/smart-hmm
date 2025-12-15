"use client";

import { QueryKey } from "@/services/react-query/constants";
import useCreateDepartment from "@/services/react-query/mutations/use-create-deparment";
import { EmployeeInfo } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Select } from "@/components/ui/select";

const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  manager: z.string().min(1, "Please select a manager").max(100),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

interface Department extends DepartmentFormValues {
  id: string;
  createdAt: string;
}

export default function CreateDepartmentModal({
  setIsModalOpen,
  employees,
  isLoadingEmployees,
}: {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  employees?: EmployeeInfo[];
  isLoadingEmployees: boolean;
}) {
  const { mutateAsync: createDepartment } = useCreateDepartment();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      manager: "",
    },
  });
  const handleCreate = async (values: DepartmentFormValues) => {
    await createDepartment({
      managerId: values.manager,
      name: values.name,
    });
    reset();
    setIsModalOpen(false);
    queryClient.invalidateQueries({
      queryKey: [QueryKey.GET_DEPARTMENTS],
    });
  };

  const onSubmit = (values: DepartmentFormValues) => {
    handleCreate(values);
  };

  return (
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
          <div>
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

            <div>
              <label className="block text-xs font-semibold mb-1">
                Manager
              </label>
              {employees && employees.length > 0 && (
                <Select
                  placeholder="Select manager"
                  {...register("manager")}
                  options={[
                    ...employees.map((emp) => ({
                      value: emp.id,
                      label: emp.firstName,
                    })),
                  ]}
                  error={errors.manager?.message}
                  className="bg-background"
                />
              )}
              {/* <input
                type="text"
                {...register("manager")}
                className="w-full rounded-md border border-[var(--color-muted)] px-3 py-2"
                placeholder="e.g. Nguyen Van A"
              /> */}
              {errors.manager && (
                <p className="mt-1 text-xs text-[var(--color-danger)]">
                  {errors.manager.message}
                </p>
              )}
            </div>
          </div>

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
  );
}
