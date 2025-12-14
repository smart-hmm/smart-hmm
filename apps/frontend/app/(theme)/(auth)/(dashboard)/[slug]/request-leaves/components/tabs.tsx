"use client";

export type TabKey = "leave" | "leave-history";

const TABS: { key: TabKey; label: string }[] = [
  { key: "leave", label: "Request Leave" },
  { key: "leave-history", label: "Leave History" }, // ✅ NEW
];

interface Props {
  value: TabKey;
  onChange: (v: TabKey) => void;
}

export function Tabs({ value, onChange }: Props) {
  return (
    <div className="px-6 pt-6">
      <div className="flex gap-8 border-b border-[var(--color-muted)]">
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
                    ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                    : "text-[var(--color-foreground)]/70 hover:text-[var(--color-primary)]"
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
