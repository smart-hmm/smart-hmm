interface Props {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

export function Select({ label, value, onChange, options }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-muted px-4 py-2.5 text-base"
      >
        {options.map((o) => (
          <option className="bg-background" key={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
