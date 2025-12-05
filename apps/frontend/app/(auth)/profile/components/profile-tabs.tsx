"use client";

export type TabKey =
  | "personal"
  | "payrolls"
  | "attendances"
  | "contract"
  | "time"
  | "assets"
  | "documents";

const TABS: { key: TabKey; label: string }[] = [
  { key: "personal", label: "Personal Information" },
  { key: "contract", label: "Contract" },
  { key: "payrolls", label: "Payrolls" },
  { key: "attendances", label: "Attendances" },
  { key: "time", label: "Time Management" },
  { key: "assets", label: "Assets" },
  { key: "documents", label: "Documents" },
];

interface Props {
  value: TabKey;
  onChange: (v: TabKey) => void;
}

export function ProfileTabs({ value, onChange }: Props) {
  return (
    <div className="px-6 pt-6">
      <div className="flex gap-8 border-b border-muted">
        {TABS.map((tab) => {
          const active = value === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`
                pb-3 text-[15px] font-semibold transition
                ${
                  active
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground/70 hover:text-primary"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
