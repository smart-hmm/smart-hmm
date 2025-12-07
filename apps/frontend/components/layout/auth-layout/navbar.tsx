"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarRange, LayoutGrid, Settings2, Users } from "lucide-react";
import useSysSettings from "@/services/react-query/queries/use-sys-settings";

export default function Navbar() {
  const pathname = usePathname();
  const { data: settings } = useSysSettings();
  const name = (settings?.find((ele) => ele.key === "general")?.value.name ??
    "") as string;

  return (
    <div className="h-[calc(100vh-50px)] w-[120px] bg-background fixed top-[50px] left-0 shadow-xl flex flex-col items-center py-6 gap-6">
      <div className="text-center flex flex-col items-center">
        <div className="w-10 h-10 rounded-xl bg-[color:var(--theme-primary)] text-white flex items-center justify-center font-bold text-lg">
          {name
            .split(" ")
            .map((ele) => ele.charAt(0))
            .slice(0, 2)
            .join("")}
        </div>
        <p className="mt-2 text-xs font-semibold text-[color:var(--theme-primary)]">
          {settings?.find((ele) => ele.key === "general")?.value.name ?? ""}
        </p>
      </div>

      <nav className="flex flex-col gap-3 w-full px-2">
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

        <Link
          href="/meeting"
          className={`
            flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-semibold transition
            ${
              pathname.startsWith("/meeting")
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-foreground)]/70 hover:bg-[var(--color-muted)]"
            }
          `}
        >
          <CalendarRange className="w-6 h-6" />
          Meeting
        </Link>

        <Link
          href="/company-settings"
          className={`
            flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-xs font-semibold transition
            ${
              pathname.startsWith("/company-settings")
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-foreground)]/70 hover:bg-[var(--color-muted)]"
            }
          `}
        >
          <Settings2 className="w-6 h-6" />
          Settings
        </Link>
      </nav>

      <div className="mt-auto mb-4 text-[10px] text-[var(--color-foreground)]/50 text-center px-2">
        © 2025 HRM
      </div>
    </div>
  );
}
