interface Props {
  label: string;
  type?: string;
  defaultValue?: string;
  disabled?: boolean;
}

export function Input({ label, type = "text", ...props }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        type={type}
        {...props}
        className="w-full rounded-md border border-[var(--color-muted)] px-4 py-2.5 text-base"
      />
    </div>
  );
}
