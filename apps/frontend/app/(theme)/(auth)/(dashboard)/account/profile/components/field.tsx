export function Field({
  label,
  value,
  trailing,
}: {
  label: string;
  value: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--color-muted)] bg-[var(--color-background)] px-4 py-3">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)]">
        {value}
        {trailing}
      </div>
    </div>
  );
}
