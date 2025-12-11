"use client";

import useDepartment from "@/services/react-query/queries/use-department";
import useEmployeesByDepartmentId from "@/services/react-query/queries/use-employees-by-department-id";
import useFiles from "@/services/react-query/queries/use-files";
import type { EmployeeInfo } from "@/types";
import { ArrowLeft } from "lucide-react";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useMemo, useState } from "react";
import { EmployeeNode } from "./components/tree-node";
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

  if (!department) {
    return (
      <div className="min-h-screen bg-background p-6">
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

  const onSwitchTab = (tab: TabKey) => {
    router.push(`${pathname}?tab=${tab}`);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 text-foreground">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-md hover:bg-muted"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold">{department.name} Department</h1>
          <p className="text-xs text-muted-foreground">
            {employees?.length ?? 0} Employees
          </p>
        </div>
      </div>

      <div className="flex gap-6 border-b border-muted">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => onSwitchTab(tab)}
            className={`pb-2 text-sm font-semibold capitalize ${
              activeTab === tab
                ? "border-b-2 border-(--theme-primary) text-(--theme-primary)"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "employees" && employees && (
        <Employees employees={employees} />
      )}

      {activeTab === "hierarchy" && <Hierarchy hierarchyTree={hierarchyTree} />}

      {activeTab === "documents" && (
        <Documents files={files ?? []} isLoading={isLoadingFiles} />
      )}
    </div>
  );
}
