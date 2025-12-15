"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "@/components/layout/auth-layout/nav-items";
import Spotlight from "./spotlight";

const NAV_TOUR_STEPS = NAV_ITEMS.filter(
  (item) => !!item.tourContent
).map((item) => ({
  id: item.id,
  target: `#${item.id}`,
  title: item.label,
  content: item.tourContent as string,
}));

const TOUR_STEPS = [
  ...NAV_TOUR_STEPS,
  {
    id: "search",
    target: "#nav-search",
    title: "Search",
    content: "Quickly find people, pages, or open search with ⌘K / Ctrl+K.",
  },
  {
    id: "notifications",
    target: "#nav-notifications",
    title: "Notifications",
    content: "See recent updates and alerts for your workspace.",
  },
  {
    id: "profile",
    target: "#nav-user-profile",
    title: "Your account",
    content: "Access your profile, account settings, and sign out from here.",
  },
  {
    id: "theme",
    target: "#nav-theme-toggle",
    title: "Appearance",
    content: "Switch between light and dark themes anytime.",
  },
];

export default function WorkspaceTour() {
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    setSeen(!!localStorage.getItem("workspace_tour_seen"));
  }, []);

  // wait for DOM targets
  useEffect(() => {
    if (seen || !TOUR_STEPS.length) return;

    let tries = 0;
    const interval = setInterval(() => {
      if (document.querySelector(TOUR_STEPS[0].target)) {
        setReady(true);
        clearInterval(interval);
      }
      if (++tries > 20) clearInterval(interval);
    }, 250);

    return () => clearInterval(interval);
  }, [seen]);

  if (seen || !ready || !TOUR_STEPS.length) return null;

  const current = TOUR_STEPS[step];
  const target = document.querySelector(current.target) as HTMLElement | null;
  if (!target) return null;

  const rect = target.getBoundingClientRect();
  const TOOLTIP_WIDTH = 288;
  const left = Math.min(
    Math.max(16, rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2),
    window.innerWidth - TOOLTIP_WIDTH - 16
  );

  return (
    <>
      <AnimatePresence>
        <Spotlight rect={rect} />
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          key={current.id}
          className="fixed z-[9999]"
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          style={{
            top: rect.bottom + 12,
            left,
          }}
        >
          <div className="w-72 rounded-xl bg-background border shadow-xl p-4">
            <h4 className="font-semibold text-sm">{current.title}</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              {current.content}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {step + 1} / {TOUR_STEPS.length}
              </span>

              <div className="flex gap-2">
                <button
                  className="text-xs text-muted-foreground"
                  onClick={() => {
                    localStorage.setItem("workspace_tour_seen", "1");
                    setReady(false);
                  }}
                >
                  Skip
                </button>

                <button
                  className="text-xs font-semibold text-primary"
                  onClick={() => {
                    if (step === TOUR_STEPS.length - 1) {
                      localStorage.setItem("workspace_tour_seen", "1");
                      setReady(false);
                    } else {
                      setStep(step + 1);
                    }
                  }}
                >
                  {step === TOUR_STEPS.length - 1 ? "Done" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
