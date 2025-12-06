import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md">
      <div
        className="
          flex items-center gap-3 rounded-xl
          border border-border/30 bg-card/70
          px-6 py-3 text-sm text-foreground
          shadow-xl
        "
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        Preparing your data...
      </div>
    </div>
  );
}
