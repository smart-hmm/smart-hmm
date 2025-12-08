"use client";

import NoDocumentFound from "@/components/ui/no-document";
import Table from "@/components/ui/table/table";
import useDepartment from "@/services/react-query/queries/use-department";
import useEmployeesByDepartmentId from "@/services/react-query/queries/use-employees-by-department-id";
import type { EmployeeInfo } from "@/types";
import { ArrowLeft } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useMemo, useState } from "react";

/* =======================
   TYPES
======================= */

interface DepartmentDocument {
  id: string;
  title: string;
  type: string;
  uploadedAt: string;
}

interface Department {
  id: string;
  name: string;
  managerId: string;
  employees: EmployeeInfo[];
  documents: DepartmentDocument[];
}

export type EmployeeNode = EmployeeInfo & {
  children: EmployeeNode[];
};

/* =======================
   TREE HELPERS
======================= */

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

/* =======================
   TREE NODE (HOVER ACTIONS)
======================= */

interface TreeNodeProps {
  node: EmployeeNode;
  selectedId?: string;
  onSelect?: (node: EmployeeNode) => void;
  onEdit?: (node: EmployeeNode) => void;
  onAddChild?: (parent: EmployeeNode) => void;
  onRemove?: (node: EmployeeNode) => void;
}

function TreeNode({
  node,
  selectedId,
  onSelect,
  onEdit,
  onAddChild,
  onRemove,
}: TreeNodeProps) {
  const isSelected = selectedId === node.id;

  return (
    <div className="flex flex-col items-center relative group">
      <div
        onClick={() => onSelect?.(node)}
        onKeyUp={() => onSelect?.(node)}
        className={`relative w-60 rounded-xl border bg-surface p-4 text-center shadow-sm cursor-pointer transition ${
          isSelected
            ? "border-[color:var(--theme-primary)] ring-2 ring-primary/30"
            : "border-muted hover:border-[color:var(--theme-primary)]/50"
        }`}
      >
        {isSelected && (
          <div className="absolute top-2 right-2  flex gap-1 z-10">
            {/* ADD CHILD */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild?.(node);
              }}
              className="w-6 h-6 flex items-center justify-center rounded bg-[color:var(--theme-primary)] text-surface text-[color:var(--theme-primary)]-foreground text-xs shadow hover:opacity-90"
              title="Add Child"
            >
              +
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(node);
              }}
              className="w-6 h-6 flex items-center justify-center rounded bg-destructive text-destructive-foreground text-xs shadow hover:opacity-90"
              title="Remove"
            >
              ×
            </button>
          </div>
        )}

        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(node);
            }}
            type="button"
            className="absolute -top-2 -left-2 rounded-full bg-[color:var(--theme-primary)] text-surface text-xs px-2 py-1 shadow"
          >
            Edit
          </button>
        )}

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
              <TreeNode
                key={child.id}
                node={child}
                selectedId={selectedId}
                onSelect={onSelect}
                onEdit={onEdit}
                onAddChild={onAddChild}
                onRemove={onRemove}
              />
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

  const [selectedNode, setSelectedNode] = useState<EmployeeNode | null>(null);
  const [editingNode, setEditingNode] = useState<EmployeeNode | null>(null);
  const [addingParent, setAddingParent] = useState<EmployeeNode | null>(null);

  const { data: employees } = useEmployeesByDepartmentId(params.id);
  const { data: department } = useDepartment(params.id);

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

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 text-foreground">
      {/* HEADER */}
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

      {/* TABS */}
      <div className="flex gap-6 border-b border-muted">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold capitalize ${
              activeTab === tab
                ? "border-b-2 border-[color:var(--theme-primary)] text-[color:var(--theme-primary)]"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* EMPLOYEES TABLE */}
      {activeTab === "employees" && employees && (
        <div className="rounded-xl border border-muted overflow-hidden">
          <Table
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
            data={employees ?? []}
          />
        </div>
      )}

      {/* ✅ HIERARCHY */}
      {activeTab === "hierarchy" && (
        <div className="flex justify-center overflow-auto py-10">
          {hierarchyTree.map((root) => (
            <TreeNode
              key={root.id}
              node={root}
              selectedId={selectedNode?.id}
              onSelect={setSelectedNode}
              onEdit={setEditingNode}
              onAddChild={setAddingParent}
              onRemove={(node) => {
                if (!confirm(`Remove ${node.firstName}?`)) return;
                alert(`Detached ${node.firstName} (managerID = null)`);
              }}
            />
          ))}
        </div>
      )}

      {activeTab === "documents" && (
        <NoDocumentFound
          actionLabel="Upload document"
          // onActionClick={() => setIsUploadModalOpen(true)}
        />
      )}

      {/* ✅ EDIT MODAL */}
      {editingNode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-6 w-[400px] space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold">
              Edit Hierarchy - {editingNode.firstName}
            </h2>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditingNode(null)}
                className="px-4 py-2 text-sm rounded-md border"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-md bg-[color:var(--theme-primary)] text-[color:var(--theme-primary)]-foreground"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ADD CHILD MODAL */}
      {addingParent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-6 w-[400px] space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold">
              Add Child to {addingParent.firstName}
            </h2>

            <p className="text-sm text-muted-foreground">
              Select an employee to attach under this manager.
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setAddingParent(null)}
                className="px-4 py-2 text-sm rounded-md border"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-md bg-[color:var(--theme-primary)] text-[color:var(--theme-primary)]-foreground"
              >
                Attach
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
