export default function SecondaryButton({ label }: { label: string }) {
  return (
    <button className="border border-[var(--color-muted)] px-4 py-2 rounded-md text-sm font-semibold">
      {label}
    </button>
  );
}
