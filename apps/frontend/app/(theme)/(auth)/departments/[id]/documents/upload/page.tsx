"use client";

import { useCallback, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileType,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import useGenPresignedURL from "@/services/react-query/mutations/use-gen-presigned-url";
import api from "@/lib/http";
import { AxiosError } from "axios";
import { defaultStyles, FileIcon } from "react-file-icon";
import { useParams } from "next/navigation";
import useConfirmUpload from "@/services/react-query/mutations/use-confirm-upload";
import { extensions } from "@/types";
import { toStandardFileType } from "@/lib/utils/utils";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".xlsx", ".pptx"];
const MAX_SIZE_MB = 20;

type UploadStatus = "idle" | "uploading" | "success" | "error";

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  url?: string; // final file URL (from your backend / S3)
};

function getExtension(filename: string) {
  const dotIdx = filename.lastIndexOf(".");
  if (dotIdx === -1) return "";
  return filename.slice(dotIdx).toLowerCase();
}

function getFileIcon(ext: string) {
  return (
    <div className="w-10 h-10">
      <FileIcon
        extension={ext.replaceAll(".", "")}
        {...defaultStyles[
          ext.replaceAll(".", "") as (typeof extensions)[number]
        ]}
      />
    </div>
  );
}

export default function UploadDocumentsPage() {
  const params = useParams<{ id: string }>();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: genPresignedUrl, isPending: isGettingUrl } =
    useGenPresignedURL();
  const { mutateAsync: confirmUpload, isPending: isConfirmingUpload } =
    useConfirmUpload();

  const validateFile = (file: File): string | null => {
    const ext = getExtension(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return "Unsupported file type. Only PDF, DOCX, XLSX, PPTX are allowed.";
    }

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      return `File is too large. Max ${MAX_SIZE_MB}MB allowed.`;
    }

    return null;
  };

  const uploadFile = async (id: string, file: File) => {
    try {
      setItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, status: "uploading", progress: 5 } : it
        )
      );

      const path = `uploads/${params.id}/${file.name}`;
      const presigned = await genPresignedUrl({
        path,
        contentType: file.type || "application/octet-stream",
      });

      const uploadUrl = presigned.url as string;
      const fileType = toStandardFileType(file);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader(
          "Content-Type",
          file.type || "application/octet-stream"
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setItems((prev) =>
              prev.map((it) =>
                it.id === id ? { ...it, progress: percent } : it
              )
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(file);
      });

      await confirmUpload({
        departmentId: params.id,
        storagePath: path,
        filename: file.name,
        contentType: fileType || "application/octet-stream",
        size: file.size,
      });

      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                status: "success",
                progress: 100,
              }
            : it
        )
      );
    } catch (err) {
      const _err = err as AxiosError;
      console.error(err);
      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                status: "error",
                error:
                  _err?.message ?? "Something went wrong while uploading file.",
              }
            : it
        )
      );
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const newItems: UploadItem[] = [];
    for (const file of Array.from(files)) {
      const error = validateFile(file);
      const id = `${file.name}-${file.size}-${
        file.lastModified
      }-${crypto.randomUUID()}`;

      newItems.push({
        id,
        file,
        progress: 0,
        status: error ? "error" : "idle",
        error: error ?? undefined,
      });
    }

    setItems((prev) => [...newItems, ...prev]);

    newItems
      .filter((item) => !item.error)
      .forEach((item) => {
        void uploadFile(item.id, item.file);
      });
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background text-foreground px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Upload documents
            </h1>
            <p className="mt-1 text-sm text-foreground/80">
              Upload PDFs, Word, Excel, and PowerPoint files.
            </p>
          </div>

          <button
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
          >
            <UploadCloud className="h-4 w-4" />
            Choose files
          </button>
        </header>

        {/* Dropzone */}
        <div
          className={[
            "relative flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 transition",
            "bg-surface/60 backdrop-blur-sm",
            dragActive
              ? "border-primary/80 bg-primary/5"
              : "border-muted hover:border-primary/50",
          ].join(" ")}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drag &amp; drop your files here
              </p>
              <p className="mt-1 text-xs text-foreground/80">
                or{" "}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="font-medium text-primary hover:underline"
                >
                  browse from your computer
                </button>
              </p>
            </div>
            <p className="mt-2 text-xs text-foreground/80">
              Supported: PDF, DOCX, XLSX, PPTX · Max {MAX_SIZE_MB}MB per file
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.docx,.xlsx,.pptx"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {isGettingUrl && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 rounded-xl border border-muted/60 bg-surface/80 px-3 py-2 text-xs text-muted shadow-sm">
                <span className="h-3 w-3 animate-ping rounded-full bg-primary/80" />
                Preparing secure upload link...
              </div>
            </div>
          )}
        </div>

        {/* Upload list */}
        <section className="space-y-3">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-muted bg-surface/70 px-4 py-6 text-center text-xs text-foreground/80">
              No documents uploaded yet. Drop some files into the area above to
              get started.
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const ext = getExtension(item.file.name);

                return (
                  <div
                    key={item.id}
                    className="group flex items-start gap-3 rounded-xl border border-muted/70 bg-surface/80 px-4 py-3 text-sm shadow-sm transition hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {getFileIcon(ext)}
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.file.name}
                          </p>
                          <p className="mt-0.5 text-xs text-foreground/80">
                            {(item.file.size / (1024 * 1024)).toFixed(2)} MB ·{" "}
                            {ext.toUpperCase()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.status === "uploading" && (
                            <span className="text-xs text-primary">
                              {item.progress}%...
                            </span>
                          )}
                          {item.status === "success" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                              <CheckCircle2 className="h-3 w-3" />
                              Uploaded
                            </span>
                          )}
                          {item.status === "error" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-medium text-danger">
                              <AlertCircle className="h-3 w-3" />
                              Failed
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="rounded-md p-1 text-muted transition hover:bg-muted/30 hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar / error */}
                      {item.status !== "error" ? (
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                          <div
                            className={[
                              "h-full rounded-full transition-all",
                              item.status === "success"
                                ? "bg-success"
                                : "bg-primary",
                            ].join(" ")}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      ) : (
                        item.error && (
                          <p className="mt-1 text-xs text-danger">
                            {item.error}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
