interface CardProps {
  title: string;
  children: React.ReactNode;
  editable?: boolean;
}

export default function Card({ title, children, editable }: CardProps) {
  return (
    <div className="bg-background border border-muted rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm">{title}</h3>
        {editable && (
          <button className="text-sm font-semibold text-primary">Edit</button>
        )}
      </div>
      {children}
    </div>
  );
}
