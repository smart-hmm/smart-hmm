import { Loader2 } from "lucide-react";

interface LoadingProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  overlay?: boolean;
}

export default function Loading({
  label = "Loading...",
  size = "md",
  overlay = false,
}: LoadingProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const content = (
    <div className="flex items-center justify-center gap-2 text-sm text-foreground">
      <Loader2 className={`${sizeMap[size]} animate-spin`} />
      {label && <span>{label}</span>}
    </div>
  );

  if (!overlay) return content;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-sm rounded-xl">
      <div className="rounded-lg border border-border/40 bg-card/60 px-4 py-2 shadow-md">
        {content}
      </div>
    </div>
  );
}
