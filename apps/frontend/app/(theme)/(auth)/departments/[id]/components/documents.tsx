"use client";

import DocumentsGrid from "@/components/ui/documents-grid";
import { extensions, FileInfo } from "@/types";
import { useParams, useRouter } from "next/navigation";

export default function Documents({
  isLoading,
  files,
}: {
  isLoading: boolean;
  files: FileInfo[];
}) {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const mapFileToDocument = (file: FileInfo) => {
    return {
      id: file.id,
      name: file.fileName,
      extension: file.contentType.replaceAll(
        "application/",
        ""
      ) as (typeof extensions)[number],
      size: file.size,
      createdAt: file.createdAt,
    };
  };

  return (
    <DocumentsGrid
      isLoading={isLoading}
      onUploadBtnClicked={() =>
        router.push(`/departments/${params.id}/documents/upload`)
      }
      onItemClicked={(item) =>
        router.push(`/departments/${params.id}/documents/${item.id}`)
      }
      documents={files ? files.map((file) => mapFileToDocument(file)) : []}
    />
  );
}
