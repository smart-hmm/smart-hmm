"use client";

import { useEffect, useMemo, useState } from "react";
import DocumentCard, { bytesToMBFormatted } from "./document-card";
import NoDocumentFound from "./no-document";
import { Upload, LayoutGrid, Table2, X } from "lucide-react";
import Table from "./table/table";
import { DateTime } from "luxon";
import type { extensions } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Document = {
  id: string | number;
  name: string;
  extension: (typeof extensions)[number];
  size: number;
  uploadBy?: {
    name: string;
    avatar?: string;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

type DocumentsGridProps = {
  isLoading: boolean;
  onItemClicked?: (item: Document) => void;
  onUploadBtnClicked?: () => void;
  documents: Document[];
};

/** ✅ Supported file types as tags */
const TYPE_TAGS = ["pptx", "pdf", "docx", "xlsx"] as const;
type TypeTag = (typeof TYPE_TAGS)[number];

const DocumentsGrid = ({
  isLoading,
  documents,
  onItemClicked,
  onUploadBtnClicked,
}: DocumentsGridProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const view = (searchParams.get("view") || "grid") as "grid" | "table";
  const typeParam = searchParams.get("type"); // "pdf,docx" | "pdf" | null
  const query = searchParams.get("q") || "";

  const parseTypesFromParam = (param: string | null): TypeTag[] => {
    if (!param || param === "all") return [];
    return param
      .split(",")
      .map((t) => t.trim())
      .filter((t): t is TypeTag => TYPE_TAGS.includes(t as TypeTag));
  };

  const [viewMode, setViewMode] = useState<"grid" | "table">(view);
  const [searchText, setSearchText] = useState(query);
  const [selectedTypes, setSelectedTypes] = useState<TypeTag[]>(
    parseTypesFromParam(typeParam)
  );

  const isAllActive = selectedTypes.length === 0;

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("tab", "documents");
    router.replace(`${pathName}?${params.toString()}`, {
      scroll: false,
    });
  };

  const updateTypesInUrl = (types: TypeTag[]) => {
    if (types.length === 0 || types.length === TYPE_TAGS.length) {
      updateParam("type");
    } else {
      updateParam("type", types.join(","));
    }
  };

  const onSwitchMode = (mode: "grid" | "table") => {
    setViewMode(mode);
    updateParam("view", mode);
  };

  const onSearchChange = (value: string) => {
    setSearchText(value);
    updateParam("q", value || undefined);
  };

  const onResetFilters = () => {
    setSearchText("");
    setSelectedTypes([]);
    router.push(`${pathName}?view=${viewMode}`, { scroll: false });
  };

  const onToggleType = (tag: TypeTag) => {
    setSelectedTypes((prev) => {
      let next: TypeTag[];

      if (prev.includes(tag)) {
        next = prev.filter((t) => t !== tag);
      } else {
        next = [...prev, tag];
      }

      return next;
    });
  };

  const onSelectAllTypes = () => {
    setSelectedTypes([]);
    updateTypesInUrl([]);
  };

  const typeCountMap = useMemo(() => {
    return TYPE_TAGS.reduce((acc, t) => {
      acc[t] = documents.filter((d) => d.extension === t).length;
      return acc;
    }, {} as Record<TypeTag, number>);
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(doc.extension as TypeTag);

      const matchName = doc.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      return matchType && matchName;
    });
  }, [documents, selectedTypes, searchText]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (selectedTypes.length === 0) {
      updateParam("type");
    } else {
      updateParam("type", selectedTypes.join(","));
    }
  }, [selectedTypes]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateParam("q", searchText || undefined);
  }, [searchText]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateParam("view", viewMode);
  }, [viewMode]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-md font-semibold text-foreground">
          Documents ({filteredDocuments.length})
        </h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 md:justify-end">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2 rounded-md border border-muted bg-muted/10 p-1">
              <button
                type="button"
                onClick={() => onSwitchMode("grid")}
                className={`
                  flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition
                  ${viewMode === "grid"
                    ? "bg-primary text-white shadow"
                    : "text-foreground hover:bg-muted/40"
                  }
                `}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </button>

              <button
                type="button"
                onClick={() => onSwitchMode("table")}
                className={`
                  flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition
                  ${viewMode === "table"
                    ? "bg-primary text-white shadow"
                    : "text-foreground hover:bg-muted/40"
                  }
                `}
              >
                <Table2 className="w-4 h-4" />
                Table
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex md:flex-row items-center flex-col gap-2">
        <div className="flex items-center gap-2 md:w-auto w-full">
          <input
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search document..."
            className="
                h-9 w-full md:w-72 rounded-md border border-muted bg-muted/10
                px-3 text-sm outline-none
                focus:ring-2 focus:ring-primary
              "
          />
        </div>

        <div className="w-full max-w-full md:max-w-[620px] w-full overflow-x-auto [-mx-2] px-2">
          <div className="flex items-center gap-2 py-1 min-w-max">
            <button
              type="button"
              onClick={onSelectAllTypes}
              className={`
                  flex items-center gap-1.5 rounded-full
                  px-3 py-1.5 text-xs font-medium border
                  transition-all duration-200 ease-out
                  transform
                  ${isAllActive
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/30 scale-[1.02]"
                  : "bg-muted/10 text-foreground border-muted hover:bg-muted/30 hover:-translate-y-0.5 hover:shadow-sm"
                }
                `}
            >
              <span>ALL</span>
              <span
                className={`
                    min-w-5 rounded-full text-[10px] px-1.5 text-center
                    ${isAllActive
                    ? "bg-white/90 text-primary"
                    : "bg-muted text-foreground"
                  }
                  `}
              >
                {documents.length}
              </span>
            </button>

            {TYPE_TAGS.map((t) => {
              const isActive = selectedTypes.includes(t);

              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onToggleType(t)}
                  className={`
                      flex items-center gap-1.5 rounded-full
                      px-3 py-1.5 text-xs font-medium border
                      transition-all duration-200 ease-out
                      transform
                      ${isActive
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/30 scale-[1.02] -translate-y-0.5"
                      : "bg-muted/10 text-foreground border-muted hover:bg-muted/30 hover:-translate-y-0.5 hover:shadow-sm"
                    }
                      active:scale-95
                    `}
                >
                  <span>{t.toUpperCase()}</span>

                  <span
                    className={`
                        min-w-5 rounded-full text-[10px] px-1.5 text-center
                        ${isActive
                        ? "bg-white/90 text-primary"
                        : "bg-muted text-foreground"
                      }
                      `}
                  >
                    {typeCountMap[t]}
                  </span>
                </button>
              );
            })}

            {(selectedTypes.length > 0 || searchText) && (
              <button
                type="button"
                onClick={onResetFilters}
                className="
                  hidden md:inline-flex
                  items-center gap-1 rounded-md
                  border border-muted bg-muted/10
                  px-3 py-1.5 text-xs
                  text-foreground hover:bg-muted/30
                  transition-colors
                "
              >
                <X className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {(selectedTypes.length > 0 || searchText) && (
          <button
            type="button"
            onClick={onResetFilters}
            className="
                inline-flex md:hidden
                w-fit self-end
                items-center gap-1 rounded-md
                border border-muted bg-muted/10
                px-3 py-1.5 text-xs
                text-foreground hover:bg-muted/30
                transition-colors
              "
          >
            <X className="w-3 h-3" />
            Reset filters
          </button>
        )}
      </div>

      {viewMode === "grid" && (
        <div>
          {!isLoading && filteredDocuments.length === 0 &&
            <NoDocumentFound
              showUpload
              onUploadClick={() => onUploadBtnClicked?.()}
            />}
          <div className="w-full grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 gap-4">
            {!isLoading && filteredDocuments.length > 0 &&
              <button
                type="button"
                onClick={() => onUploadBtnClicked?.()}
                className="
              min-h-40
              flex flex-col items-center justify-center gap-3
              rounded-md border border-dashed border-muted
              bg-muted/10 hover:bg-muted/30 transition
            "
              >
                <Upload className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Upload Document
                </span>
              </button>
            }

            {isLoading &&
              Array(10)
                .fill(null)
                .map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <DocumentCard key={i}>
                    <DocumentCard.Loading className="w-full" />
                  </DocumentCard>
                ))}

            {!isLoading &&
              (filteredDocuments.length > 0 &&
                filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    onClick={() => onItemClicked?.(doc)}
                    className="
                    bg-muted/20 rounded-md p-4
                    transition-all
                    hover:shadow-xl hover:bg-muted/40
                  "
                  >
                    <DocumentCard.Extension
                      extension={doc.extension}
                      className="w-[80%] max-w-14 mx-auto"
                    />
                    <DocumentCard.Info
                      compact={false}
                      name={doc.name}
                      createdAt={doc.createdAt}
                      fileSize={doc.size}
                    />
                  </DocumentCard>
                )))}
          </div>
        </div>
      )
      }

      {viewMode === "table" && (
        <div className="w-full space-y-3">
          <div className="flex items-center justify-start pb-2">
            <button
              type="button"
              onClick={() => onUploadBtnClicked?.()}
              className="
                flex items-center gap-2
                rounded-md
                bg-primary text-white
                px-4 py-2 text-sm font-medium
                transition hover:opacity-90
              "
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>

          <Table
            columns={[
              {
                label: "Name",
                mapToField: "name",
                render: (_, row) => (
                  <div
                    className="cursor-pointer text-primary font-medium hover:underline"
                    onKeyDown={() => onItemClicked?.(row)}
                    onClick={() => onItemClicked?.(row)}
                  >
                    {row.name}
                  </div>
                ),
              },
              {
                label: "Type",
                mapToField: "extension",
              },
              {
                label: "Size",
                mapToField: "size",
                render: (_, row) => <p>{bytesToMBFormatted(row.size)}</p>,
              },
              {
                label: "Created At",
                mapToField: "createdAt",
                render: (_, row) => {
                  if (!row.createdAt) return "-";
                  return (
                    <p>
                      {DateTime.fromISO(
                        typeof row.createdAt === "string"
                          ? row.createdAt
                          : row.createdAt.toString()
                      ).toFormat("dd/MM/yyyy")}
                    </p>
                  );
                },
              },
            ]}
            data={filteredDocuments}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentsGrid;
