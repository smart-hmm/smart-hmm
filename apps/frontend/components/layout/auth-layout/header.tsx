"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import useSysSettings from "@/services/react-query/queries/use-sys-settings";
import {
  ArrowContainer,
  Popover,
  type PopoverPosition,
  type Rect,
} from "react-tiny-popover";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogout } from "@/services/react-query/mutations/use-logout";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSelector } from "react-redux";
import type { RootState } from "@/services/redux/store";

export default function Header() {
  const router = useRouter();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const { mutateAsync: logout } = useLogout();
  const pathname = usePathname();
  const selectedTenant = useSelector(
    (state: RootState) => state.tenants.selectedTenant
  )

  const shortName = selectedTenant?.name
    .split(" ")
    .map((ele) => ele.charAt(0))
    .slice(0, 2)
    .join("");

  const navItems = [
    {
      id: "nav-departments",
      href: "/departments",
      label: "Departments",
    },
    {
      id: "nav-employees",
      href: "/employees",
      label: "Employees",
    },
    {
      id: "nav-meeting",
      href: "/meeting",
      label: "Meeting",
    },
    {
      id: "nav-settings",
      href: "/company-settings",
      label: "Settings",
    },
  ];

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-40
        h-[60px]
        bg-background
        border-b border-muted
        shadow-sm

      "
    >
      <div className="max-w-7xl px-6 flex items-center h-full mx-auto relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-(--theme-primary) text-white flex items-center justify-center font-bold text-sm">
            {shortName}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">
              {selectedTenant?.name || "HRM"}
            </span>
          </div>
        </div>
        <div className="flex items-center pl-10">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                id={item.id}
                key={item.href}
                href={`/${selectedTenant?.workspaceSlug}${item.href}`}
                className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/70 hover:underline"
                }
              `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="absolute right-9 flex items-center gap-2">
          <Popover
            isOpen={isPopoverOpen}
            positions={["top", "bottom", "left", "right"]}
            containerStyle={{
              top: "-5px",
              zIndex: "50",
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
                arrowColor={"var(--color-background)"}
                arrowSize={10}
                className="popover-arrow-container"
                arrowClassName="popover-arrow"
              >
                <div
                  className="bg-background text-foreground 
                border border-muted/50
                rounded-md px-6 py-3 shadow-2xl z-50 
                box-border flex flex-col gap-2 items-center text-sm"
                  onKeyDown={() => {
                    setPopoverOpen(!isPopoverOpen);
                  }}
                  onClick={() => {
                    setPopoverOpen(!isPopoverOpen);
                  }}
                >
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      router.push("/account/profile");
                    }}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      router.push("/account/settings");
                    }}
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer"
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
              type="button"
              id="nav-user-profile"
              onClick={() => setPopoverOpen(!isPopoverOpen)}
              className="rounded-full bg-surface w-[30px] aspect-square flex items-center justify-center cursor-pointer"
            >
              <UserRound color="#aaaaaa" size={24} />
            </button>
          </Popover>
          <div id="nav-theme-toggle">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
