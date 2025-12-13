"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FirstRunPage() {
  const router = useRouter();
  const params = useSearchParams();

  const isFirstRun = params.get("firstRun") === "1";
  const [loading, setLoading] = useState(false);

  // Guard: if user lands here accidentally
  useEffect(() => {
    if (!isFirstRun) {
      localStorage.removeItem("workspace_tour_seen");
      router.replace("/");
    }
  }, [isFirstRun, router]);

  async function completeFirstRun(startTour: boolean) {
    setLoading(true);

    try {
      // Optional: tell backend first-run is completed
      await fetch("/api/tenants/first-run-complete", {
        method: "POST",
      });
    } catch {
      // non-blocking
    }

    if (startTour) {
      router.replace("?tour=1");
    } else {
      router.replace("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl rounded-2xl bg-background p-10 shadow-sm text-center"
      >
        <h1 className="text-2xl font-semibold">Welcome to your workspace</h1>

        <p className="mt-3 text-sm text-slate-500">
          You’re all set. Let’s take a quick look around so you know where
          everything lives.
        </p>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={() => completeFirstRun(true)}
            className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Take a quick tour
          </motion.button>

          <button
            disabled={loading}
            onClick={() => completeFirstRun(false)}
            className="w-full rounded-lg border py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Skip for now
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          You can always restart the tour from Settings.
        </p>
      </motion.div>
    </div>
  );
}
