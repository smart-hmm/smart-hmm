import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-2xl overflow-hidden">
      <div className="absolute w-[300px] h-[300px] rounded-full bg-primary/30 blur-[120px] animate-pulse" />
      <div className="absolute w-[250px] h-[250px] -top-20 -left-20 rounded-full bg-secondary/30 blur-[120px] animate-pulse delay-700" />
      <div className="absolute w-[200px] h-[200px] -bottom-20 -right-20 rounded-full bg-accent/30 blur-[120px] animate-pulse delay-1000" />
      <div
        className="
          relative z-10 w-20 h-20
          rounded-2xl
          border border-white/20 dark:border-white/10
          bg-white/20 dark:bg-white/10
          backdrop-blur-xl
          shadow-[0_10px_50px_rgba(0,0,0,0.35)]
          flex items-center justify-center
          animate-[float_3.5s_ease-in-out_infinite]
        "
      >
        {/* Rotating Ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-primary border-r-secondary animate-spin" />

        {/* Inner Spinner */}
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    </div>
  );
}
