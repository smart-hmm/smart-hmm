import { ReactNode } from "react";

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[var(--color-primary)] mb-6">
        {title}
      </h2>
      {children}
    </div>
  );
}
