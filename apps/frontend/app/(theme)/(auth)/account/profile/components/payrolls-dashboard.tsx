"use client";

import Card from "@/components/ui/card";
import InfoItem from "@/components/ui/info-item";
import SummaryCard from "@/components/ui/summary-card";
import { Td, Th } from "@/components/ui/table";

export function PayrollsDashboard() {
  return (
    <div className="space-y-6">
      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Basic Salary" value="$8,000 / month" />
        <SummaryCard title="Bonus (This Month)" value="$300" />
        <SummaryCard title="Tax Deduction" value="$500" />
        <SummaryCard title="Net Salary" value="$7,800" />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ========== LEFT (2/3) ========== */}
        <div className="xl:col-span-2 space-y-6">
          {/* Salary Breakdown */}
          <Card title="Salary Breakdown">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Payment Type" value="Monthly Salary" />
              <InfoItem label="Basic Salary" value="$8,000" />
              <InfoItem label="Bonus" value="$300" />
              <InfoItem label="Allowances" value="$0" />
              <InfoItem label="Deductions" value="$500" />
              <InfoItem label="Net Salary" value="$7,800" />
            </div>
          </Card>

          {/* Payment History */}
          <Card title="Payment History">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-[var(--color-surface)]">
                  <tr>
                    <Th>Month</Th>
                    <Th>Gross</Th>
                    <Th>Deduction</Th>
                    <Th>Net Paid</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {PAYROLL_HISTORY.map((p) => (
                    <tr key={p.month} className="border-t">
                      <Td>{p.month}</Td>
                      <Td>{p.gross}</Td>
                      <Td>{p.deduction}</Td>
                      <Td className="font-semibold">{p.net}</Td>
                      <Td>
                        <StatusBadge status={p.status} />
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
          {/* Tax Information */}
          <Card title="Tax Information">
            <div className="space-y-4">
              <InfoItem label="Tax Residence" value="Indonesia" />
              <InfoItem label="Tax Status" value="Single (TK/0)" />
              <InfoItem label="NPWP Registered" value="Yes" />
            </div>
          </Card>

          {/* Bank Information */}
          <Card title="Bank Account">
            <div className="space-y-4">
              <InfoItem label="Bank Name" value="BCA" />
              <InfoItem label="Account Number" value="1234 5678 9999" />
              <InfoItem label="Account Holder" value="Panji Dwi" />
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

type PayrollStatus = "Paid" | "Pending";

interface PayrollHistoryItem {
  month: string;
  gross: string;
  deduction: string;
  net: string;
  status: PayrollStatus;
}

const PAYROLL_HISTORY: PayrollHistoryItem[] = [
  {
    month: "December 2025",
    gross: "$8,300",
    deduction: "$500",
    net: "$7,800",
    status: "Paid",
  },
  {
    month: "November 2025",
    gross: "$8,000",
    deduction: "$500",
    net: "$7,500",
    status: "Paid",
  },
  {
    month: "October 2025",
    gross: "$8,100",
    deduction: "$500",
    net: "$7,600",
    status: "Paid",
  },
];

/* =======================
   SHARED UI
======================= */

function StatusBadge({ status }: { status: PayrollStatus }) {
  if (status === "Paid") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-success)]/20 text-[var(--color-success)]">
        Paid
      </span>
    );
  }

  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/20">
      Pending
    </span>
  );
}
