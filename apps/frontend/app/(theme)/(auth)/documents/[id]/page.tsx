"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { useMemo } from "react";

const MOCK_DOCUMENT = {
    id: "123",
    title: "Quarterly Financial Report",
    url: "https://pharma30.s3.ap-southeast-2.amazonaws.com/uploads/Fullstack_CV.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAVLV3DLOAUPOGPFZS%2F20251209%2Fap-southeast-2%2Fs3%2Faws4_request&X-Amz-Date=20251209T122357Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0yIkYwRAIgDqoXd6VROWCKSNrYAXLd93%2B5KynmmcYXq1Ltgqyj7c4CIDj0VpGS2ymlJuAUIocjoAC%2BVkDNKuNlfaz1sIB%2BtpMFKqYCCL3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMzY4Njg1ODMzMDg5Igw7Tq6yTpCTm1HtFTAq%2BgGlwl%2BxzhWAoKusURpAobcXOS35EZKpehjYE8xLs8JaMeMu44S8qQp4hZ9EoPdLqiq6eQQLjfCkn1vQ3lX8mPjFlRkr84eebGt35y3rWzlZJFX1GSgxOeQkRxe3O0MuD83XXwYP4QCwqppsr5jZFZ7N5Sl4Zzl6YmEpajL4vJuWDrkMRHjPAi7ryUQUTnhs%2BA%2Fkxy5U9R36ETIQHd7oVc4mPKhvE9jXjNYMxkiK5E2Qvmie%2FxHUOcZ4q46aDlfogu5tzmw7g1RGc8E8XW4vvnHIQ806GBk5KqbpnRasjdDaZ50r3KakAkp1rAIVhKay36N36upDlxVMnpS1MIT538kGOuABh9TwDUj01bApBl6SHZ9H%2B2xpQjYRqYJjjZAil%2Ftf%2BmUjpRehg%2F7%2Fg40pWIzY%2BQCfRBLSPHNL2D5iI%2FFVCPEfQnSUGaoXcF52ELNgM8SoD1MsiejfRhV0ELhFPxiLGZFSE3qWun1zvILJ%2BzVrhxz%2FXi4lq4iwwPrO3MdwWDM3kHb%2FXL6vo1g4m91fNOzKpkNl7QK0ui0vNi0f1t9yAvWWwmtTZ4BKY4A3DM5MKU9dqNpIfnvjRs10NE4RtaCkSNM5hMo104D5kApAbDj5Gow5ul6mCMY7jDb2ZaZwo7Q2adU%3D&X-Amz-Signature=386a911cb70994c3ebd804fa2c39e967a081e83f829a35a469c6fcf8c3c7e433&X-Amz-SignedHeaders=host&response-content-disposition=inline",
    type: "pdf", // pdf | docx | xlsx | pptx
};

export default function DocumentViewerPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const doc = MOCK_DOCUMENT; // ✅ replace with real query later

    const viewerUrl = useMemo(() => {
        if (!doc?.url) return "";

        if (doc.type === "pdf") return doc.url;

        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            doc.url
        )}`;
    }, [doc]);

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
                        type='button'
                        onClick={() => router.back()}
                        className="p-2 rounded-md hover:bg-[color:var(--color-muted)]"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div>
                        <h1 className="text-sm font-semibold">{doc.title}</h1>
                        <p className="text-xs text-foreground uppercase">
                            {doc.type}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <a
                        href={doc.url}
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
                        href={doc.url}
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

            {/* ===============================
          ✅ VIEWER BODY
      =============================== */}
            <div className="flex-1 bg-[color:var(--color-muted)] p-3">
                <div
                    className="
            w-full h-full rounded-lg overflow-hidden
            bg-[color:var(--color-surface)]
            shadow-lg border border-[color:var(--color-muted)]
          "
                >
                    {doc.type === "pdf" ? (
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
