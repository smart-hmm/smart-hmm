"use client";

import { EmployeeInfo } from "@/types";

interface TreeNodeProps {
  node: EmployeeNode;
  selectedId?: string;
  onSelect?: (node: EmployeeNode) => void;
  onEdit?: (node: EmployeeNode) => void;
  onAddChild?: (parent: EmployeeNode) => void;
  onRemove?: (node: EmployeeNode) => void;
}

export type EmployeeNode = EmployeeInfo & {
  children: EmployeeNode[];
};

export function TreeNode({
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
            ? "border-(--theme-primary) ring-2 ring-primary/30"
            : "border-muted hover:border-(--theme-primary)/50"
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
              className="w-6 h-6 flex items-center justify-center rounded bg-(--theme-primary) text-surface text-[color:var(--theme-primary)]-foreground text-xs shadow hover:opacity-90"
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
            className="absolute -top-2 -left-2 rounded-full bg-(--theme-primary) text-surface text-xs px-2 py-1 shadow"
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
