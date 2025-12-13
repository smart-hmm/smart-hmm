"use client";

import ActionButton from "@/components/ui/action-button";
import Card from "@/components/ui/card";
import SummaryCard from "@/components/ui/summary-card";
import { Td, Th } from "@/components/ui/table";
import { useMemo, useState } from "react";

type LeaveStatus = "Pending" | "Approved" | "Rejected";

interface LeaveHistoryItem {
  id: string;
  date: string;
  type: string;
  reason: string;
  status: LeaveStatus;
}

export function RequestLeaveHistoryDashboard() {
  const [filter, setFilter] = useState<LeaveStatus | "All">("All");

  const filteredData = useMemo(() => {
    if (filter === "All") return LEAVE_HISTORY;
    return LEAVE_HISTORY.filter((l) => l.status === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Total Requests" value="6" />
        <SummaryCard title="Approved" value="3" />
        <SummaryCard title="Pending" value="2" />
        <SummaryCard title="Rejected" value="1" />
      </div>

      {/* ================= MAIN TABLE ================= */}
      <Card title="Leave Request History">
        {/* Filters */}
        <div className="flex gap-3 mb-4">
          {["All", "Pending", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as LeaveStatus | "All")}
              className={`
                px-4 py-2 rounded-md text-sm font-semibold border
                ${
                  filter === s
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : "border-[var(--color-muted)] hover:bg-[var(--color-muted)]"
                }
              `}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-[var(--color-surface)]">
              <tr>
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Reason</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((l) => (
                <tr key={l.id} className="border-t">
                  <Td>{l.date}</Td>
                  <Td>{l.type}</Td>
                  <Td>{l.reason}</Td>
                  <Td>
                    <StatusBadge status={l.status} />
                  </Td>
                  <Td>
                    {l.status === "Pending" ? (
                      <ActionButton label="Cancel" />
                    ) : (
                      <span className="text-xs text-[var(--color-foreground)]/50">
                        —
                      </span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const LEAVE_HISTORY: LeaveHistoryItem[] = [
  {
    id: "1",
    date: "2025-12-02",
    type: "Annual Leave",
    reason: "Family event",
    status: "Pending",
  },
  {
    id: "2",
    date: "2025-11-18",
    type: "Sick Leave",
    reason: "Flu",
    status: "Approved",
  },
  {
    id: "3",
    date: "2025-11-10",
    type: "Annual Leave",
    reason: "Personal work",
    status: "Approved",
  },
  {
    id: "4",
    date: "2025-10-01",
    type: "Unpaid Leave",
    reason: "Personal",
    status: "Rejected",
  },
  {
    id: "5",
    date: "2025-09-20",
    type: "Sick Leave",
    reason: "Covid recovery",
    status: "Approved",
  },
  {
    id: "6",
    date: "2025-09-02",
    type: "Annual Leave",
    reason: "Vacation",
    status: "Pending",
  },
];

function StatusBadge({ status }: { status: LeaveStatus }) {
  if (status === "Approved") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-success)]/20 text-[var(--color-success)]">
        Approved
      </span>
    );
  }

  if (status === "Rejected") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-danger)]/20 text-[var(--color-danger)]">
        Rejected
      </span>
    );
  }

  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/20">
      Pending
    </span>
  );
}
