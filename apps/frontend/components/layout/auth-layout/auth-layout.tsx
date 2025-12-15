"use client";

import Header from "./header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen min-h-screen bg-surface">
      <Header />
      <main>
        <div className="w-full max-w-7xl mx-auto min-h-screen bg-surface px-0 box-border">
          {children}
        </div>
      </main>
    </div>
  );
}
