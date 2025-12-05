interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export function Textarea({ label, value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border px-4 py-2.5 text-base"
      />
    </div>
  );
}
