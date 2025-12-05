"use client";

import Card from "@/components/ui/card";
import InfoItem from "@/components/ui/info-item";
import SummaryCard from "@/components/ui/summary-card";
import { Td, Th } from "@/components/ui/table";

export function AssetsDashboard() {
  return (
    <div className="space-y-6">
      {/* ================= SUMMARY KPIs ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Total Assets Assigned" value="5 Items" />
        <SummaryCard title="Active Assets" value="4 Items" />
        <SummaryCard title="Returned Assets" value="1 Item" />
        <SummaryCard title="Damaged / Lost" value="0 Item" />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ========== LEFT (2/3) ========== */}
        <div className="xl:col-span-2 space-y-6">
          {/* Assigned Assets Table */}
          <Card title="Assigned Assets">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-[var(--color-surface)]">
                  <tr>
                    <Th>Asset Name</Th>
                    <Th>Category</Th>
                    <Th>Serial Number</Th>
                    <Th>Issued Date</Th>
                    <Th>Status</Th>
                    <Th>Condition</Th>
                  </tr>
                </thead>
                <tbody>
                  {ASSET_DATA.map((a) => (
                    <tr key={a.serial} className="border-t">
                      <Td>{a.name}</Td>
                      <Td>{a.category}</Td>
                      <Td>{a.serial}</Td>
                      <Td>{a.issuedDate}</Td>
                      <Td>
                        <StatusBadge status={a.status} />
                      </Td>
                      <Td>
                        <ConditionBadge condition={a.condition} />
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
          {/* Asset Policy */}
          <Card title="Asset Policy">
            <div className="space-y-4 text-sm">
              <InfoItem label="Max Assets / Employee" value="5 Items" />
              <InfoItem label="Damage Liability" value="Employee Responsible" />
              <InfoItem label="Return Policy" value="Upon Exit" />
              <InfoItem label="Audit Frequency" value="Every 6 Months" />
            </div>
          </Card>

          {/* Asset Request Summary */}
          <Card title="Asset Requests">
            <div className="space-y-4 text-sm">
              <InfoItem label="Pending Requests" value="0" />
              <InfoItem label="Approved Requests" value="2" />
              <InfoItem label="Rejected Requests" value="1" />
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

type AssetStatus = "Active" | "Returned";
type AssetCondition = "Good" | "Damaged" | "Lost";

interface AssetItem {
  name: string;
  category: string;
  serial: string;
  issuedDate: string;
  status: AssetStatus;
  condition: AssetCondition;
}

const ASSET_DATA: AssetItem[] = [
  {
    name: "MacBook Pro 14”",
    category: "Laptop",
    serial: "MBP-2023-001",
    issuedDate: "2023-09-18",
    status: "Active",
    condition: "Good",
  },
  {
    name: "iPhone 14",
    category: "Mobile",
    serial: "IPH-2023-014",
    issuedDate: "2023-10-05",
    status: "Active",
    condition: "Good",
  },
  {
    name: "Jabra Headset",
    category: "Accessory",
    serial: "ACC-2023-022",
    issuedDate: "2023-10-12",
    status: "Returned",
    condition: "Good",
  },
  {
    name: "Office Chair",
    category: "Furniture",
    serial: "FUR-2023-033",
    issuedDate: "2023-09-20",
    status: "Active",
    condition: "Good",
  },
  {
    name: "Monitor Dell 27”",
    category: "Display",
    serial: "MON-2023-011",
    issuedDate: "2023-09-22",
    status: "Active",
    condition: "Good",
  },
];

function StatusBadge({ status }: { status: AssetStatus }) {
  if (status === "Active") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-success)]/20 text-[var(--color-success)]">
        Active
      </span>
    );
  }

  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-muted)] text-[var(--color-foreground)]">
      Returned
    </span>
  );
}

function ConditionBadge({ condition }: { condition: AssetCondition }) {
  if (condition === "Good") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-success)]/20 text-[var(--color-success)]">
        Good
      </span>
    );
  }

  if (condition === "Damaged") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/20">
        Damaged
      </span>
    );
  }

  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-danger)]/20 text-[var(--color-danger)]">
      Lost
    </span>
  );
}
