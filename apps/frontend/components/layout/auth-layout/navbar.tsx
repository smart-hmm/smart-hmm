"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-[120px] bg-background fixed top-[50px] left-0 shadow-xl flex flex-col items-center py-6 gap-6">
      {/* ================= BRAND ================= */}
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg">
          H
        </div>
        <p className="mt-2 text-xs font-semibold text-[var(--color-primary)]">
          HRM
        </p>
      </div>

      {/* ================= NAV ITEMS ================= */}
      <nav className="flex flex-col gap-3 w-full px-2">
        {/* Departments */}
        <Link
          href="/departments"
          className={`
            flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-semibold transition
            ${
              pathname.startsWith("/departments")
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-foreground)]/70 hover:bg-[var(--color-muted)]"
            }
          `}
        >
          <LayoutGrid className="w-6 h-6" />
          Departments
        </Link>

        {/* Employees */}
        <Link
          href="/employees"
          className={`
            flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-semibold transition
            ${
              pathname.startsWith("/employees")
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-foreground)]/70 hover:bg-[var(--color-muted)]"
            }
          `}
        >
          <Users className="w-6 h-6" />
          Employees
        </Link>
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="mt-auto mb-4 text-[10px] text-[var(--color-foreground)]/50 text-center px-2">
        © 2025 HRM
      </div>
    </div>
  );
}
