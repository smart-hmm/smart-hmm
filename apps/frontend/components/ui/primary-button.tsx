export default function PrimaryButton({ label }: { label: string }) {
  return (
    <button className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md text-sm font-semibold">
      {label}
    </button>
  );
}
