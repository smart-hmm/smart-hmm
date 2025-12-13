"use client";

import { motion } from "framer-motion";

export default function Spotlight({ rect }: { rect: DOMRect }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9998] pointer-events-none"
    >
      <div
        className="absolute rounded-xl"
        style={{
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
          borderRadius: "12px",
        }}
      />
    </motion.div>
  );
}
