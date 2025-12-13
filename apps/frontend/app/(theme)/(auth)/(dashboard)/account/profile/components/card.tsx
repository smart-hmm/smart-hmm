export function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-muted)] bg-[var(--color-background)] p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--color-foreground)]">
          {title}
        </h3>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
