export type NavItem = {
  id: string;
  href: string;
  label: string;
  tourContent?: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    id: "nav-home",
    href: "/",
    label: "Home",
    tourContent: "Jump back to your workspace overview.",
  },
  {
    id: "nav-departments",
    href: "/departments",
    label: "Departments",
    tourContent: "Organize teams and reporting structure.",
  },
  {
    id: "nav-employees",
    href: "/employees",
    label: "Employees",
    tourContent: "Manage employee profiles and contracts.",
  },
  {
    id: "nav-meeting",
    href: "/meeting",
    label: "Meeting",
    tourContent: "Schedule and manage meetings.",
  },
  {
    id: "nav-settings",
    href: "/company-settings",
    label: "Settings",
    tourContent: "Configure company policies and preferences.",
  },
];
