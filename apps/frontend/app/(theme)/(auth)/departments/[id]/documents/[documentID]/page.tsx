"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { useMemo } from "react";
import useFile from "@/services/react-query/queries/use-file";
import Loading from "@/app/loading";

export default function DocumentViewerPage() {
  const router = useRouter();
  const params = useParams<{ documentID: string }>();
  const { data: document, isLoading: isLoadingDocument } = useFile(
    params.documentID ?? null
  );
  const viewerUrl = useMemo(() => {
    if (!document?.downloadURL) return "";

    if (document.file.contentType.includes("pdf")) return document.downloadURL;

    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      document.downloadURL
    )}`;
  }, [document]);

  if (isLoadingDocument) return <Loading />;

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <div
        className="
          flex items-center justify-between
          border-b border-[color:var(--color-muted)]
          bg-[color:var(--color-surface)]
          px-4 py-3
        "
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-md hover:bg-[color:var(--color-muted)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-sm font-semibold">{document?.file.fileName}</h1>
            <p className="text-xs text-foreground uppercase">
              {document?.file.contentType
                ? document.file.contentType.replaceAll("application/", "")
                : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={document?.downloadURL}
            download
            className="
              flex items-center gap-1
              px-3 py-1.5 text-xs rounded-md
              bg-[color:var(--theme-primary)]
              text-white hover:opacity-90
            "
          >
            <Download size={14} />
            Download
          </a>

          <a
            href={document?.downloadURL}
            rel="noreferrer"
            target="_blank"
            className="
              flex items-center gap-1
              px-3 py-1.5 text-xs rounded-md
              border border-[color:var(--color-muted)]
              hover:bg-[color:var(--color-muted)]
            "
          >
            <ExternalLink size={14} />
            Open
          </a>
        </div>
      </div>

      <div className="flex-1 bg-[color:var(--color-muted)] p-3">
        <div
          className="
            w-full h-full rounded-lg overflow-hidden
            bg-[color:var(--color-surface)]
            shadow-lg border border-[color:var(--color-muted)]
          "
        >
          {document?.file.contentType.includes("pdf") ? (
            <embed
              src={viewerUrl}
              type="application/pdf"
              className="w-full h-full"
            />
          ) : (
            <iframe
              title="doc-viewer"
              src={viewerUrl}
              className="w-full h-full border-none"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
}
