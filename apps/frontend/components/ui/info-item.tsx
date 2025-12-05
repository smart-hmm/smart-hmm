interface InfoItemProps {
  label: string;
  value: string;
}

export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs text-foreground/60 mb-1">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}
