"use client";

import { FileX, Upload } from "lucide-react";

type NoDocumentFoundProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  showUpload?: boolean;
  onUploadClick?: () => void;
};

export default function NoDocumentFound({
  title = "No documents found",
  description = "There are no files here yet. Upload your first document to get started.",
  actionLabel,
  onActionClick,
  showUpload = false,
  onUploadClick,
}: NoDocumentFoundProps) {
  return (
    <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden">
      <div
        className="
          relative z-10
          flex max-w-md flex-col items-center gap-6
          rounded-3xl border border-foreground/10
          bg-card/60 px-8 py-10 text-center
          shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)] bg-background
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

        <div className="flex flex-wrap items-center justify-center gap-3 text-white">
          {showUpload && onUploadClick && (
            <button
              type="button"
              onClick={onUploadClick}
              className="
                group inline-flex items-center gap-2
                rounded-full px-6 py-2.5 text-sm font-medium
                bg-primary text-primary-foreground
                shadow-lg shadow-primary/20
                transition-all duration-300
                hover:scale-[1.04]
                hover:shadow-xl hover:shadow-primary/30
                active:scale-[0.98]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-primary/60 focus-visible:ring-offset-2
              "
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </button>
          )}

          {actionLabel && onActionClick && (
            <button
              type="button"
              onClick={onActionClick}
              className="
                inline-flex items-center justify-center
                rounded-full px-5 py-2.5 text-sm font-medium
                border border-foreground/15
                bg-background/60 text-foreground
                transition-all
                hover:bg-background/80
                hover:shadow-md
              "
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
