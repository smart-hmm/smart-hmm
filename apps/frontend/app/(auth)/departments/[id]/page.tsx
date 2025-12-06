"use client";

import useDepartment from "@/services/react-query/queries/use-department";
import useEmployeesByDepartmentId from "@/services/react-query/queries/use-employees-by-department-id";
import { EmployeeInfo } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useMemo, useState } from "react";

interface DepartmentDocument {
  id: string;
  title: string;
  type: string;
  uploadedAt: string;
}

interface Department {
  id: string;
  name: string;
  managerId: string; // top-level manager
  employees: EmployeeInfo[];
  documents: DepartmentDocument[];
}

type EmployeeNode = EmployeeInfo & {
  children: EmployeeNode[];
};

/* =======================
   TREE HELPERS
======================= */

function buildTree(employees: EmployeeInfo[]): EmployeeNode[] {
  const map = new Map<string, EmployeeNode>();

  employees.forEach((emp) => {
    map.set(emp.id, { ...emp, children: [] });
  });

  const roots: EmployeeNode[] = [];

  map.forEach((emp) => {
    if (emp.managerID) {
      const parent = map.get(emp.managerID);
      parent?.children.push(emp);
    } else {
      roots.push(emp);
    }
  });

  return roots;
}

/* =======================
   RECURSIVE TREE NODE
======================= */

function TreeNode({
  node,
}: {
  node: EmployeeInfo & { children: EmployeeNode[] };
}) {
  return (
    <div className="flex flex-col items-center relative">
      <div className="w-60 rounded-xl border border-muted bg-surface p-4 text-center shadow-sm">
        <p className="font-semibold">
          {node.firstName}, {node.lastName}
        </p>
        <p className="text-sm text-muted-foreground">{node.position}</p>
        <p className="text-xs text-muted-foreground mt-1">{node.email}</p>
      </div>

      {node.children.length > 0 && (
        <>
          <div className="w-px h-8 bg-muted" />
          <div className="flex gap-10 mt-4 relative">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* =======================
   TABS
======================= */

const TABS = ["employees", "hierarchy", "documents"] as const;
type TabKey = (typeof TABS)[number];

/* =======================
   PAGE
======================= */

export default function DepartmentDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>("employees");
  const { data: employees, isLoading: isLoadingEmployees } =
    useEmployeesByDepartmentId(params.id);
  const { data: department, isLoading: isLoadingDepartment } = useDepartment(
    params.id
  );

  const hierarchyTree = useMemo<EmployeeNode[]>(() => {
    if (!employees) return [];
    return buildTree(employees);
  }, [employees]);

  if (!department) {
    return (
      <div className="min-h-screen bg-background p-6">
        <button
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
    <div className="min-h-screen bg-background p-6 space-y-6 text-foreground">
      <div className="flex items-center gap-3">
        <button
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
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold capitalize ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "employees" && employees && (
        <div className="rounded-xl border border-muted overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Position</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Manager</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-t border-muted">
                  <td className="px-4 py-3 font-medium">
                    {emp.firstName}, {emp.lastName}
                  </td>
                  <td className="px-4 py-3">{emp.position}</td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3">
                    {employees.find((e) => e.id === emp.managerID)
                      ? `${
                          employees.find((e) => e.id === emp.managerID)
                            ?.firstName
                        }, ${
                          employees.find((e) => e.id === emp.managerID)
                            ?.lastName
                        }`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ DOCUMENTS */}
      {/* {activeTab === "documents" && (
        <div className="space-y-3">
          {department.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-lg border border-muted p-4"
            >
              <div>
                <p className="font-semibold">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.type} • Uploaded {doc.uploadedAt}
                </p>
              </div>
              <button className="px-3 py-1 text-xs rounded-md border">
                View
              </button>
            </div>
          ))}
        </div>
      )} */}

      {/* ✅✅✅ AUTO TREE FROM managerId */}
      {activeTab === "hierarchy" && (
        <div className="flex justify-center overflow-auto py-10">
          {hierarchyTree.map((root) => (
            <TreeNode key={root.id} node={root} />
          ))}
        </div>
      )}
    </div>
  );
}
