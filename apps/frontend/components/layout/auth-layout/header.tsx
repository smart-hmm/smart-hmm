"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Eye,
  Globe2,
  HelpCircle,
  LogOut,
  Palette,
  Search,
  Settings,
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowContainer,
  Popover,
  type PopoverPosition,
  type Rect,
} from "react-tiny-popover";
import { useSelector } from "react-redux";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLogout } from "@/services/react-query/mutations/use-logout";
import { useMe } from "@/services/react-query/queries/use-me";
import type { RootState } from "@/services/redux/store";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { mutateAsync: logout } = useLogout();

  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isMac, setIsMac] = useState(false);

  const selectedTenant = useSelector(
    (state: RootState) => state.tenants.selectedTenant
  );

  const { data: me } = useMe();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const platform = window?.navigator?.platform ?? "";
    const ua = window?.navigator?.userAgent ?? "";
    setIsMac(/Mac|iPhone|iPod|iPad/.test(platform) || /Mac OS X/.test(ua));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setPopoverOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isSearchOpen]);

  const shortName = selectedTenant?.name
    ?.split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  const userFullName = useMemo(() => {
    const first = me?.employee?.firstName?.trim() ?? "";
    const last = me?.employee?.lastName?.trim() ?? "";
    const fullName = `${first} ${last}`.trim();
    return fullName || selectedTenant?.name || "User";
  }, [me, selectedTenant?.name]);

  const userEmail = useMemo(
    () => me?.employee?.email || me?.user?.email || "",
    [me]
  );

  const userInitials = useMemo(() => {
    const source = userFullName || userEmail;
    const letters = source
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "");
    return letters.join("") || "U";
  }, [userEmail, userFullName]);

  const handleNavigate = (href: string) => {
    setPopoverOpen(false);
    router.push(href);
  };

  const handleLogout = async () => {
    setPopoverOpen(false);
    await logout();
    window.location.reload();
  };

  const accountActions = [
    {
      id: "profile",
      label: "Profile settings",
      icon: Settings,
      onClick: () => handleNavigate("/account/profile"),
    },
    {
      id: "language",
      label: "Language and region",
      icon: Globe2,
      onClick: () => handleNavigate("/account/settings?tab=localization"),
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
      onClick: () => handleNavigate("/account/settings?tab=appearance"),
    },
  ];

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
        ${scrolled
          ? "bg-muted/60 backdrop-blu shadow-sm"
          : "bg-linear-to-b from-primary/40 to-transparent"
        }
      `}
    >
      <div
        className={`
          max-w-7xl mx-auto px-6
          flex items-center justify-between
          transition-all duration-300
          ${scrolled ? "h-16 backdrop-blur-lg" : "h-[72px]"}
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

        <nav className="hidden md:flex items-center gap-2">
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
                ${isActive
                    ? `
                      bg-background
                      text-foreground
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-2 py-1.5 text-primary">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-sm font-semibold text-primary shadow-inner transition hover:bg-white/80"
            >
              <Search className="h-4 w-4" strokeWidth={2.2} />
              <span className="text-[13px] font-semibold text-primary">
                {isMac ? "⌘K" : "Ctrl K"}
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary transition hover:bg-primary/20"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          <Popover
            isOpen={isPopoverOpen}
            onClickOutside={() => setPopoverOpen(false)}
            positions={["bottom", "top"]}
            padding={12}
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
                arrowSize={10}
              >
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="w-72 overflow-hidden rounded-2xl border border-muted/80 bg-background shadow-2xl"
                >
                  <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-semibold text-white shadow">
                      {userInitials}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="text-base font-semibold text-foreground">
                        {userFullName}
                      </div>
                      {userEmail ? (
                        <div className="text-xs text-muted-foreground truncate">
                          {userEmail}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="px-2 pb-2 flex flex-col gap-1">
                    {accountActions.map(
                      ({ id, label, icon: Icon, onClick }) => (
                        <button
                          type="button"
                          key={id}
                          onClick={onClick}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground transition hover:bg-muted/60"
                        >
                          <Icon size={18} className="text-muted-foreground" />
                          <span className="flex-1">{label}</span>
                          <ChevronRight
                            size={16}
                            className="text-muted-foreground"
                          />
                        </button>
                      )
                    )}
                  </div>

                  <div className="border-t border-muted/80 px-2 py-2">
                    <button
                      type='button'
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger transition hover:bg-danger/10"
                    >
                      <LogOut size={18} className="text-danger" />
                      <span className="flex-1 text-foreground">Log out</span>
                    </button>
                  </div>
                </motion.div>
              </ArrowContainer>
            )}
          >
            <button
              type="button"
              id="nav-user-profile"
              onClick={() => setPopoverOpen((v) => !v)}
              aria-expanded={isPopoverOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
            >
              {userInitials}
            </button>
          </Popover>

          <div id="nav-theme-toggle">
            <ThemeToggle />
          </div>
        </div>
      </div>
      {isSearchOpen && (
        <div
          onKeyDown={() => { }}
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-24 backdrop-blur-[2px]">
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-full max-w-5xl rounded-full bg-white px-4 py-2 shadow-2xl shadow-black/20"
          >
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" strokeWidth={2.2} />
              <input
                ref={searchInputRef}
                placeholder="Search for people, pages or ask Deel AI"
                className="w-full rounded-full bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-0"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted/60"
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </header>
  );
}
