export function ProfileHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">
        Profile settings
      </h1>

      <div className="mt-2 flex gap-6 border-b border-[var(--color-muted)] text-sm">
        <button className="border-b-2 border-[var(--color-primary)] pb-2 font-medium text-[var(--color-primary)]">
          Personal
        </button>
        <button className="pb-2 text-slate-500 hover:text-[var(--color-foreground)]">
          Account access
        </button>
      </div>
    </div>
  );
}
