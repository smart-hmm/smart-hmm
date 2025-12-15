"use client";

import { Select } from "@/components/ui/select";
import useDepartment from "@/services/react-query/queries/use-department";
import useEmployeesByDepartmentId from "@/services/react-query/queries/use-employees-by-department-id";
import useFiles from "@/services/react-query/queries/use-files";
import type { EmployeeInfo, EmploymentStatus, EmploymentType } from "@/types";
import {
  ArrowLeft,
  Download,
  FileText,
  GitBranch,
  LayoutGrid,
  List,
  Search,
  Users,
} from "lucide-react";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useMemo, useState } from "react";
import type { EmployeeNode } from "./components/tree-node";
import Hierarchy from "./components/hierarchy";
import Employees from "./components/employees";
import Documents from "./components/documents";

function buildTree(employees: EmployeeInfo[]): EmployeeNode[] {
  const map = new Map<string, EmployeeNode>();

  for (const emp of employees) {
    map.set(emp.id, { ...emp, children: [] });
  }

  const roots: EmployeeNode[] = [];

  for (const [, emp] of map) {
    if (emp.managerID) {
      const parent = map.get(emp.managerID);
      parent?.children.push(emp);
    } else {
      roots.push(emp);
    }
  }

  return roots;
}

const TABS = ["employees", "hierarchy", "documents"] as const;
type TabKey = (typeof TABS)[number];

export default function DepartmentDetailsClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tab = searchParams.get("tab") || "employees";
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>(tab as TabKey);
  const { data: employees } = useEmployeesByDepartmentId(params.id);
  const { data: department } = useDepartment(params.id);
  const { data: files, isLoading: isLoadingFiles } = useFiles(
    params.id ?? null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmploymentStatus | "ALL">(
    "ALL"
  );
  const [typeFilter, setTypeFilter] = useState<EmploymentType | "ALL">("ALL");

  const hierarchyTree = useMemo<EmployeeNode[]>(() => {
    if (!employees) return [];
    return buildTree(employees);
  }, [employees]);

  const onSwitchTab = (tab: TabKey) => {
    const searchParams = new URLSearchParams();
    searchParams.set("tab", tab);
    router.push(`${pathname}?${searchParams.toString()}`);
    setActiveTab(tab);
  };

  const navSections = useMemo(
    () => [
      {
        title: "Overview",
        items: [
          {
            key: "employees" as TabKey,
            label: "Employees List",
            icon: Users,
            helper: `${employees?.length ?? 0} people`,
          },
          {
            key: "hierarchy" as TabKey,
            label: "Hierarchy",
            icon: GitBranch,
            helper: "Reporting tree",
          },
        ],
      },
      {
        title: "Documents",
        items: [
          {
            key: "documents" as TabKey,
            label: "Files & Folders",
            icon: FileText,
            helper: `${files?.length ?? 0} items`,
          },
        ],
      },
    ],
    [employees?.length, files?.length]
  );

  const filteredEmployees = useMemo<EmployeeInfo[]>(() => {
    if (!employees) return [];
    const query = searchTerm.trim().toLowerCase();

    return employees.filter((emp) => {
      const matchesSearch =
        query.length === 0 ||
        `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.phone} ${emp.code}`
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "ALL" || emp.employmentStatus === statusFilter;
      const matchesType =
        typeFilter === "ALL" || emp.employmentType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [employees, searchTerm, statusFilter, typeFilter]);

  const activeCount =
    employees?.filter((emp) => emp.employmentStatus === "ACTIVE").length ?? 0;
  const inactiveCount =
    employees?.filter((emp) => emp.employmentStatus !== "ACTIVE").length ?? 0;

  if (!department) {
    return (
      <div className="relative min-h-screen bg-background p-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <p className="mt-4 text-sm text-muted-foreground">
          Department not found.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f7f8fb] text-foreground">
      <div className="absolute inset-x-0 top-0 h-28" aria-hidden />

      <div className="relative mx-auto flex max-w-[1440px] gap-4 px-6 pb-14 pt-10">
        <aside className="flex h-full w-[25%] flex-col rounded-3xl border border-muted/50 bg-white shadow-sm">
          <div className="flex flex-col gap-6 px-5 py-5">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </p>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => onSwitchTab(item.key)}
                        className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-sm transition ${
                          isActive
                            ? "border-[color:var(--theme-primary)]/30 bg-[color-mix(in_srgb,var(--theme-primary),transparent_92%)] text-foreground shadow-sm"
                            : "border-transparent bg-muted/40 text-foreground hover:border-muted"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              isActive
                                ? "bg-white text-[color:var(--theme-primary)]"
                                : "bg-white text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="flex flex-col">
                            <span className="font-semibold">{item.label}</span>
                            <span className="text-[11px] text-muted-foreground">
                              {item.helper}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-dashed border-muted/60 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Department health</p>
              <p className="mt-1">
                {activeCount} active | {inactiveCount} inactive
              </p>
            </div>
          </div>
        </aside>

        <main className="rounded-3xl border w-[75%] border-muted/50 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-muted/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-muted bg-white text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Department
                </p>
                <h1 className="text-2xl font-bold leading-tight text-foreground">
                  {department.name}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {employees?.length ?? 0} total employees
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-muted bg-muted/40 text-muted-foreground transition hover:bg-muted"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-muted bg-muted/40 text-muted-foreground transition hover:bg-muted"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[color:var(--theme-primary)] px-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {activeTab === "employees" && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-muted/50 px-6 py-4">
              <div className="min-w-[220px]">
                <p className="text-lg font-semibold text-foreground">
                  {filteredEmployees.length} Employees
                </p>
                <p className="text-xs text-muted-foreground">
                  Showing filtered results for this department
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-60">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-muted bg-muted/40 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[color:var(--theme-primary)] focus:ring-2 focus:ring-[color:var(--theme-primary)]/30"
                    placeholder="Search employees"
                  />
                </div>

                <Select
                  multiple={false}
                  value={statusFilter}
                  onValueChange={(val) =>
                    setStatusFilter(val as EmploymentStatus | "ALL")
                  }
                  className="w-[180px] min-w-[180px] max-w-[180px] flex-shrink-0"
                  options={[
                    { value: "ALL", label: "All status" },
                    { value: "ACTIVE", label: "Active" },
                    { value: "INACTIVE", label: "Inactive" },
                    { value: "SUSPENDED", label: "Suspended" },
                  ]}
                />

                <Select
                  multiple={false}
                  value={typeFilter}
                  onValueChange={(val) =>
                    setTypeFilter(val as EmploymentType | "ALL")
                  }
                  className="w-[180px] min-w-[180px] max-w-[180px] flex-shrink-0"
                  options={[
                    { value: "ALL", label: "All types" },
                    { value: "FULL_TIME", label: "Full time" },
                    { value: "PART_TIME", label: "Part time" },
                    { value: "CONTRACT", label: "Contract" },
                  ]}
                />
              </div>
            </div>
          )}

          <div className="w-full flex-1 p-6">
            {activeTab === "employees" && (
              <Employees
                employees={filteredEmployees}
                totalCount={employees?.length ?? 0}
              />
            )}

            {activeTab === "hierarchy" && (
              <Hierarchy hierarchyTree={hierarchyTree} />
            )}

            {activeTab === "documents" && (
              <Documents files={files ?? []} isLoading={isLoadingFiles} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
