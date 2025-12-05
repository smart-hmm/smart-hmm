"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CreateDepartmentPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex flex-col">
      {/* Top Navigation */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-[var(--color-muted)] bg-[var(--color-surface)] shrink-0">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-[var(--color-muted)] transition"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--color-primary)]" />
        </button>

        <h1 className="text-lg font-semibold text-[var(--color-primary)]">
          Create Department
        </h1>
      </div>

      {/* Page Content */}
      <div className="flex-1 px-6 py-8">
        <form className="space-y-6 max-w-3xl mx-auto">
          {/* Department Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Department Name
            </label>
            <input
              type="text"
              placeholder="e.g. Human Resources"
              className="w-full rounded-lg border border-[var(--color-muted)] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Department Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Department Code
            </label>
            <input
              type="text"
              placeholder="e.g. HR"
              className="w-full rounded-lg border border-[var(--color-muted)] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Manager */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Department Manager
            </label>
            <select className="w-full rounded-lg border border-[var(--color-muted)] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
              <option>Select Manager</option>
              <option>Jane Doe</option>
              <option>John Smith</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={5}
              placeholder="Short description about this department..."
              className="w-full rounded-lg border border-[var(--color-muted)] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              defaultChecked
              className="accent-[var(--color-success)] w-4 h-4"
            />
            <span className="text-sm">Active Department</span>
          </div>

          {/* Bottom Page Actions (NOT Fixed) */}
          <div className="pt-10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-lg text-sm font-medium border border-[var(--color-muted)] hover:bg-[var(--color-muted)] transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-2.5 rounded-lg text-sm font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition shadow-md"
            >
              Create Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
