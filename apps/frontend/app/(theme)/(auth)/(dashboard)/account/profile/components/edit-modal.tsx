"use client";

import { X } from "lucide-react";

export function EditModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-xl bg-[var(--color-background)] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
            {title}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-slate-500 hover:text-[var(--color-danger)]" />
          </button>
        </div>

        <div className="space-y-4">{children}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-slate-500 hover:bg-[var(--color-muted)]"
          >
            Cancel
          </button>
          <button className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm text-white">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
