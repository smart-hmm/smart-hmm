export default function ActionButton({ label }: { label: string }) {
  return (
    <button className="px-3 py-1 border border-muted rounded-md text-xs font-semibold hover:bg-muted">
      {label}
    </button>
  );
}
