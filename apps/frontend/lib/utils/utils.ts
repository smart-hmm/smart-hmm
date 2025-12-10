import { DocumentType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toStandardFileType(file: File): DocumentType | null {
  const mimeMap: Record<string, DocumentType> = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
  };

  if (file.type && mimeMap[file.type]) {
    return mimeMap[file.type];
  }

  const ext = file.name.split(".").pop()?.toLowerCase();

  const extMap: Record<string, DocumentType> = {
    pdf: "pdf",
    docx: "docx",
    xlsx: "xlsx",
    pptx: "pptx",
  };

  if (ext && extMap[ext]) {
    return extMap[ext];
  }

  return null;
}
