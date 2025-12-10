"use client";

import Header from "./header";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen min-h-screen bg-surface">
      <header>
        <Header />
      </header>
      <main>
        <div className="mt-[50px] w-full max-w-7xl mx-auto min-h-screen bg-surface p-8 box-border">
          {children}
        </div>
      </main>
    </div>
  );
}
