"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "reveal" | "hold" | "reset";

const TIPS = [
  {
    text: "Centralized & transparent HR management",
    gradient: "from-cyan-100 via-teal-200 to-blue-300",
  },
  {
    text: "Real-time attendance & performance tracking",
    gradient: "from-sky-100 via-indigo-200 to-violet-300",
  },
  {
    text: "Enterprise-grade security for HR data",
    gradient: "from-neutral-200 via-slate-300 to-zinc-400",
  },
];

export default function Loading() {
  const text = "SmartHRM";
  const letters = useMemo(() => text.split(""), []);

  const [phase, setPhase] = useState<Phase>("reveal");
  const [visibleCount, setVisibleCount] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === "reveal") {
      timer = setInterval(() => {
        setVisibleCount((c) => {
          if (c >= letters.length) {
            setPhase("hold");
            return c;
          }
          return c + 1;
        });
      }, 120);
    }

    if (phase === "hold") {
      timer = setTimeout(() => setPhase("reset"), 800);
    }

    if (phase === "reset") {
      timer = setTimeout(() => {
        setVisibleCount(0);
        setTipIndex((i) => (i + 1) % TIPS.length);
        setPhase("reveal");
      }, 400);
    }

    return () => clearTimeout(timer);
  }, [phase, letters.length]);

  const currentTip = TIPS[tipIndex];

  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={tipIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={`
      absolute inset-0
      bg-gradient-to-br ${currentTip.gradient}
      bg-[length:250%_250%]
      animate-gradient-modern
    `}
        />
      </AnimatePresence>

      <div className="relative flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex">
            {letters.map((ch, i) => {
              const visible = i < visibleCount;
              return (
                <motion.span
                  key={i}
                  animate={
                    visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
                  }
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="text-5xl sm:text-6xl font-semibold text-slate-900"
                >
                  {ch}
                </motion.span>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-sm sm:text-base text-slate-600"
            >
              {currentTip.text}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

<style jsx>{`
  @keyframes gradientModern {
    0% {
      background-position: 0% 50%;
    }
    35% {
      background-position: 100% 50%;
    }
    65% {
      background-position: 50% 100%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .animate-gradient-modern {
    animation: gradientModern 8s ease-in-out infinite;
  }
`}</style>;
