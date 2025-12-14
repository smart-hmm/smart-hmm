"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md text-center"
      >
        {/* Subtle badge */}
        <div
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
          style={{
            background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
            color: "var(--color-primary)",
          }}
        >
          404 Error
        </div>

        {/* Big number */}
        <h1 className="text-[96px] font-semibold leading-none tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold">
          Page not found
        </h2>

        {/* Description */}
        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "color-mix(in srgb, var(--color-foreground) 65%, transparent)" }}
        >
          Sorry, the page you’re looking for doesn’t exist or was moved.
          If you typed the URL manually, please double-check it.
        </p>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-80"
            style={{
              borderColor: "var(--color-muted)",
              background: "var(--color-surface)",
            }}
          >
            <ArrowLeft size={16} />
            Go back
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: "var(--color-primary)" }}
          >
            Go home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
