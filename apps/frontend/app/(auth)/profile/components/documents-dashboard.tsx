"use client";

import Card from "@/components/ui/card";
import InfoItem from "@/components/ui/info-item";
import SummaryCard from "@/components/ui/summary-card";
import { Td, Th } from "@/components/ui/table";

export function DocumentsDashboard() {
  return (
    <div className="space-y-6">
      {/* ================= SUMMARY KPIs ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Total Documents" value="8 Files" />
        <SummaryCard title="Verified" value="6 Files" />
        <SummaryCard title="Pending Review" value="2 Files" />
        <SummaryCard title="Expired" value="0 File" />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ========== LEFT (2/3) ========== */}
        <div className="xl:col-span-2 space-y-6">
          {/* Documents Table */}
          <Card title="Employee Documents">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-[var(--color-surface)]">
                  <tr>
                    <Th>Document Name</Th>
                    <Th>Category</Th>
                    <Th>Uploaded At</Th>
                    <Th>Expiry Date</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {DOCUMENT_DATA.map((d) => (
                    <tr key={d.name} className="border-t">
                      <Td>{d.name}</Td>
                      <Td>{d.category}</Td>
                      <Td>{d.uploadedAt}</Td>
                      <Td>{d.expiryDate}</Td>
                      <Td>
                        <StatusBadge status={d.status} />
                      </Td>
                      <Td>
                        <div className="flex gap-2">
                          <ActionButton label="View" />
                          <ActionButton label="Download" />
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ========== RIGHT (1/3) ========== */}
        <div className="space-y-6">
          {/* Upload Rules */}
          <Card title="Upload Rules">
            <div className="space-y-4 text-sm">
              <InfoItem label="Allowed Formats" value="PDF, JPG, PNG" />
              <InfoItem label="Max File Size" value="5 MB" />
              <InfoItem label="Max Files / Category" value="3 Files" />
              <InfoItem label="Verification Time" value="1 – 2 Days" />
            </div>
          </Card>

          {/* Document Categories */}
          <Card title="Document Categories">
            <div className="space-y-3 text-sm">
              <CategoryItem label="Identity Documents" count="2 Files" />
              <CategoryItem label="Education Certificates" count="2 Files" />
              <CategoryItem label="Employment Contracts" count="1 File" />
              <CategoryItem label="Tax Documents" count="1 File" />
              <CategoryItem label="Other Documents" count="2 Files" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =======================
   MOCK DATA
======================= */

type DocumentStatus = "Verified" | "Pending" | "Expired";

interface DocumentItem {
  name: string;
  category: string;
  uploadedAt: string;
  expiryDate: string;
  status: DocumentStatus;
}

const DOCUMENT_DATA: DocumentItem[] = [
  {
    name: "ID Card.pdf",
    category: "Identity",
    uploadedAt: "2025-01-12",
    expiryDate: "2030-01-12",
    status: "Verified",
  },
  {
    name: "Tax Document 2024.pdf",
    category: "Tax",
    uploadedAt: "2025-02-05",
    expiryDate: "2026-02-05",
    status: "Verified",
  },
  {
    name: "Employment Contract.pdf",
    category: "Contract",
    uploadedAt: "2025-01-18",
    expiryDate: "-",
    status: "Verified",
  },
  {
    name: "Bachelor Certificate.jpg",
    category: "Education",
    uploadedAt: "2025-03-01",
    expiryDate: "-",
    status: "Pending",
  },
  {
    name: "NPWP Scan.pdf",
    category: "Tax",
    uploadedAt: "2025-03-10",
    expiryDate: "-",
    status: "Pending",
  },
];

function CategoryItem({ label, count }: { label: string; count: string }) {
  return (
    <div className="flex items-center justify-between border border-[var(--color-muted)] rounded-md px-4 py-2">
      <span>{label}</span>
      <span className="text-xs font-semibold text-[var(--color-primary)]">
        {count}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  if (status === "Verified") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-success)]/20 text-[var(--color-success)]">
        Verified
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/20">
        Pending
      </span>
    );
  }

  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-danger)]/20 text-[var(--color-danger)]">
      Expired
    </span>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="px-3 py-1 border border-[var(--color-muted)] rounded-md text-xs font-semibold hover:bg-[var(--color-muted)]">
      {label}
    </button>
  );
}
