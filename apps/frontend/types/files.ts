export type ConfirmUploadPayload = {
  departmentId: string;
  storagePath: string;
  filename: string;
  contentType?: string;
  size: number;
};

export type FileInfo = {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  storagePath: string;
  departmentId: string;
  uploadedBy: string;
  createdAt: string;
  deletedAt: string | null;
};
