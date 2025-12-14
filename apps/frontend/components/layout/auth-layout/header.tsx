"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import {
  ArrowContainer,
  Popover,
  type PopoverPosition,
  type Rect,
} from "react-tiny-popover";
import { useSelector } from "react-redux";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLogout } from "@/services/react-query/mutations/use-logout";
import type { RootState } from "@/services/redux/store";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { mutateAsync: logout } = useLogout();

  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const selectedTenant = useSelector(
    (state: RootState) => state.tenants.selectedTenant
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shortName = selectedTenant?.name
    ?.split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  const navItems = [
    { id: "nav-home", href: "/", label: "Home" },
    { id: "nav-departments", href: "/departments", label: "Departments" },
    { id: "nav-employees", href: "/employees", label: "Employees" },
    { id: "nav-meeting", href: "/meeting", label: "Meeting" },
    { id: "nav-settings", href: "/company-settings", label: "Settings" },
  ];

  return (
    <header
      className={`
        sticky top-0 z-40 w-full
        transition-all duration-300
        ${
          scrolled
            ? "bg-background/80 backdrop-blur border-b border-muted shadow-sm"
            : "bg-gradient-to-b from-primary/10 to-transparent"
        }
      `}
    >
      <div
        className={`
          max-w-7xl mx-auto px-6
          flex items-center justify-between
          transition-all duration-300
          ${scrolled ? "h-[56px]" : "h-[72px]"}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm">
            {shortName}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">
              {selectedTenant?.name || "HRM"}
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const cleanPath =
              pathname.replace(`/${selectedTenant?.workspaceSlug ?? ""}`, "") ||
              "/";

            const isActive =
              item.href === "/"
                ? cleanPath === "/"
                : cleanPath === item.href ||
                  cleanPath.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={`/${selectedTenant?.workspaceSlug}${item.href}`}
                className={`
                relative px-4 py-2 rounded-xl text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? `
                      bg-primary/15
                      text-primary
                    `
                    : `
                      text-foreground/70
                      hover:text-foreground
                      hover:bg-muted/60`
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Popover
            isOpen={isPopoverOpen}
            positions={["bottom", "top"]}
            containerStyle={{
              zIndex: "40",
            }}
            content={({
              position,
              childRect,
              popoverRect,
            }: {
              position: PopoverPosition;
              childRect: Rect;
              popoverRect: Rect;
            }) => (
              <ArrowContainer
                position={position}
                childRect={childRect}
                popoverRect={popoverRect}
                arrowColor="var(--color-background)"
                arrowSize={8}
              >
                <div
                  className="bg-background border border-muted rounded-lg shadow-xl px-4 py-2 text-sm flex flex-col gap-2"
                  onClick={() => setPopoverOpen(false)}
                >
                  <button onClick={() => router.push("/account/profile")}>
                    Profile
                  </button>
                  <button onClick={() => router.push("/account/settings")}>
                    Settings
                  </button>
                  <button
                    onClick={async () => {
                      await logout();
                      window.location.reload();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </ArrowContainer>
            )}
          >
            <button
              onClick={() => setPopoverOpen((v) => !v)}
              className="w-8 h-8 rounded-full bg-surface flex items-center justify-center"
            >
              <UserRound size={18} className="text-muted-foreground" />
            </button>
          </Popover>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
