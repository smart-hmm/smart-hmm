"use client";

import useDepartment from "@/services/react-query/queries/use-department";
import useEmployeesByDepartmentId from "@/services/react-query/queries/use-employees-by-department-id";
import useFiles from "@/services/react-query/queries/use-files";
import type { EmployeeInfo } from "@/types";
import { ArrowLeft, FileText, GitBranch, Users } from "lucide-react";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

  const hierarchyTree = useMemo<EmployeeNode[]>(() => {
    if (!employees) return [];
    return buildTree(employees);
  }, [employees]);

  const onSwitchTab = (tab: TabKey) => {
    const searchParams = new URLSearchParams()
    searchParams.set("tab", tab)
    router.push(`${pathname}?${searchParams.toString()}`);
    setActiveTab(tab);
  };

  const navSections = useMemo(
    () => [
      {
        title: "Department",
        items: [
          {
            key: "employees" as TabKey,
            label: "Employees",
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
            label: "Files",
            icon: FileText,
            helper: `${files?.length ?? 0} items`,
          },
        ],
      },
    ],
    [employees?.length, files?.length]
  );

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
    <div className="relative min-h-scree text-foreground">
      <div
        className="absolute inset-x-0 top-0 h-28"
        aria-hidden
      />

      <div className="relative mx-auto px-6 pb-14 pt-10 space-y-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-full bg-white/60 backdrop-blur transition hover:bg-white shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold">{department.name} Department</h1>
            <p className="text-xs text-muted-foreground">
              {employees?.length ?? 0} Employees
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <aside className="sticky w-[25%] top-20 h-full rounded-3xl border border-muted/50 bg-background/80 backdrop-blur">
            <div className="space-y-6 px-4 py-4">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-2">
                  <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.key;
                      return (
                        <button
                          type="button"
                          key={item.key}
                          onClick={() => onSwitchTab(item.key)}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                            isActive
                              ? "bg-white text-[color:var(--theme-primary)] shadow-sm ring-1 ring-muted"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`flex h-9 w-9 items-center justify-center ${
                                isActive
                                  ? "border-[color:var(--theme-primary)] bg-white"
                                  : "border-muted bg-background"
                              }`}
                            >
                              <Icon
                                className={`h-5 w-5 ${
                                  isActive
                                    ? "text-[color:var(--theme-primary)]"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </span>
                            <div className="flex flex-col">
                              <span className="font-semibold capitalize">
                                {item.label}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {item.helper}
                              </span>
                            </div>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main className="rounded-3xl border border-muted/50 bg-background/80 backdrop-blur p-6 w-[75%]">
            <div className="w-full flex-1 relative">
            {activeTab === "employees" && employees && (
              <Employees employees={employees} />
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
    </div>
  );
}
