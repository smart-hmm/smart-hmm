"use client";

import Header from "./header";
import Navbar from "./navbar";

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
      <nav>
        <Navbar />
      </nav>
      <main>
        <div className="mt-[50px] ml-[120px] w-[calc(100vw-120px)] min-h-screen bg-surface p-8 box-border">
          {children}
        </div>
      </main>
    </div>
  );
}
