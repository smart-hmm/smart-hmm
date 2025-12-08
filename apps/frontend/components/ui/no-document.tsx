"use client";

import { FileX } from "lucide-react";

type NoDocumentFoundProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

export default function NoDocumentFound({
  title = "No documents found",
  description = "There are no files here yet. Upload your first document to get started.",
  actionLabel,
  onActionClick,
}: NoDocumentFoundProps) {
  return (
    <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden">
      <div
        className="
          relative z-10
          flex max-w-md flex-col items-center gap-6
          rounded-3xl border border-foreground/10
          bg-card/60 px-8 py-10 text-center
          shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]
          backdrop-blur-xl"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
          <div
            className="
              relative z-10 flex h-20 w-20 items-center justify-center
              rounded-full border border-primary/30
              bg-primary/10
            "
          >
            <FileX className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {actionLabel && onActionClick && (
          <button
            type="button"
            onClick={onActionClick}
            className="
              group mt-2 inline-flex items-center justify-center
              rounded-full px-6 py-2.5 text-sm font-medium
              bg-primary text-primary-foreground
              shadow-lg shadow-primary/20
              transition-all duration-300
              hover:scale-[1.03]
              hover:shadow-xl hover:shadow-primary/30
              active:scale-[0.98]
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-primary/60 focus-visible:ring-offset-2
            "
          >
            <span className="relative z-10">{actionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
