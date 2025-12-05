import { ReactNode } from "react";

interface Props {
  title?: string;
  headers: string[];
  children: ReactNode;
}

export function TableWrapper({ title, headers, children }: Props) {
  return (
    <div className="max-w-6xl mx-auto">
      {title && (
        <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4">
          {title}
        </h2>
      )}

      <div className="rounded-md shadow-md border border-solid border-surface overflow-hidden p-4">
        <table className="w-full text-base">
          <thead className="bg-[var(--color-surface)]">
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-left px-6 py-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
