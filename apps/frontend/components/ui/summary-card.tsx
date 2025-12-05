export default function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-surface border border-muted rounded-xl p-5">
      <p className="text-xs text-foreground/60 mb-1">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
