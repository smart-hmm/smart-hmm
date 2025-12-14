"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface FirstRunGuideModalProps {
  open: boolean;
  onClose?: () => void;
}

export default function FirstRunGuideModal({
  open,
  onClose,
}: FirstRunGuideModalProps) {
  const router = useRouter();

  function completeFirstRun(startTour: boolean) {
    if (startTour) {
      localStorage.removeItem("workspace_tour_seen");
    } else {
      localStorage.setItem("workspace_tour_seen", "1");
    }

    onClose?.();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-background p-8 shadow-xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h1 className="text-xl font-semibold">
                Welcome to your workspace
              </h1>

              <p className="mt-3 text-sm text-muted-foreground">
                You’re all set. Let’s take a quick look around so you know where
                everything lives.
              </p>

              {/* Actions */}
              <div className="mt-8 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => completeFirstRun(true)}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground"
                >
                  Take a quick tour
                </motion.button>

                <button
                  onClick={() => completeFirstRun(false)}
                  className="w-full rounded-lg border py-2.5 text-sm text-muted-foreground hover:bg-muted"
                >
                  Skip for now
                </button>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                You can always restart the tour from Settings.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
