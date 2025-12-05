"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <div className="h-16 flex items-center gap-3 px-6 border-b border-[var(--color-muted)] bg-[var(--color-surface)]">
      <button
        onClick={() => router.back()}
        className="p-2 rounded-md hover:bg-[var(--color-muted)]"
      >
        <ArrowLeft className="w-6 h-6 text-[var(--color-primary)]" />
      </button>

      <h1 className="text-xl font-bold text-[var(--color-primary)]">
        Request Leaves
      </h1>
    </div>
  );
}
