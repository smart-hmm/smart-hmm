"use client";

import { useState } from "react";
import { EmployeeNode, TreeNode } from "./tree-node";

export default function Hierarchy({
  hierarchyTree,
}: {
  hierarchyTree: EmployeeNode[];
}) {
  const [selectedNode, setSelectedNode] = useState<EmployeeNode | null>(null);
  const [editingNode, setEditingNode] = useState<EmployeeNode | null>(null);
  const [addingParent, setAddingParent] = useState<EmployeeNode | null>(null);

  return (
    <>
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
                className="px-4 py-2 text-sm rounded-md bg-(--theme-primary) text-[color:var(--theme-primary)]-foreground"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="px-4 py-2 text-sm rounded-md bg-(--theme-primary) text-[color:var(--theme-primary)]-foreground"
              >
                Attach
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
