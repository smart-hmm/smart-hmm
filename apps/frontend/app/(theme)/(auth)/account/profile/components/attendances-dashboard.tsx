"use client";

import Card from "@/components/ui/card";
import InfoItem from "@/components/ui/info-item";
import SummaryCard from "@/components/ui/summary-card";
import { Td, Th } from "@/components/ui/table";

export function AttendanceDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Total Working Days" value="20 Days" />
        <SummaryCard title="Present" value="18 Days" />
        <SummaryCard title="Late" value="2 Days" />
        <SummaryCard title="Overtime" value="6 Hours" />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ========== LEFT (2/3) ========== */}
        <div className="xl:col-span-2 space-y-6">
          {/* Attendance Table */}
          <Card title="Daily Attendance">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-[var(--color-surface)]">
                  <tr>
                    <Th>Date</Th>
                    <Th>Check In</Th>
                    <Th>Check Out</Th>
                    <Th>Working Hours</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {ATTENDANCE_DATA.map((a) => (
                    <tr key={a.date} className="border-t">
                      <Td>{a.date}</Td>
                      <Td>{a.checkIn}</Td>
                      <Td>{a.checkOut}</Td>
                      <Td>{a.workingHours}</Td>
                      <Td>
                        <StatusBadge status={a.status} />
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
          {/* Attendance Rules */}
          <Card title="Attendance Rules">
            <div className="space-y-4 text-sm">
              <InfoItem label="Working Hours" value="09:00 - 18:00" />
              <InfoItem label="Late After" value="09:15" />
              <InfoItem label="Overtime Starts" value="18:30" />
              <InfoItem label="Weekend Policy" value="Weekend Off" />
            </div>
          </Card>

          {/* Absence Summary */}
          <Card title="Absence Summary">
            <div className="space-y-4 text-sm">
              <InfoItem label="Leave Taken" value="1 Day" />
              <InfoItem label="Sick Leave" value="1 Day" />
              <InfoItem label="Absent Without Leave" value="0 Day" />
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

type AttendanceStatus = "Present" | "Late" | "Absent";

interface AttendanceItem {
  date: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  status: AttendanceStatus;
}

const ATTENDANCE_DATA: AttendanceItem[] = [
  {
    date: "2025-12-05",
    checkIn: "08:55",
    checkOut: "18:10",
    workingHours: "9h 15m",
    status: "Present",
  },
  {
    date: "2025-12-04",
    checkIn: "09:22",
    checkOut: "18:00",
    workingHours: "8h 38m",
    status: "Late",
  },
  {
    date: "2025-12-03",
    checkIn: "-",
    checkOut: "-",
    workingHours: "0h",
    status: "Absent",
  },
];

function StatusBadge({ status }: { status: AttendanceStatus }) {
  if (status === "Present") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-success)]/20 text-[var(--color-success)]">
        Present
      </span>
    );
  }

  if (status === "Late") {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/20">
        Late
      </span>
    );
  }

  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-danger)]/20 text-[var(--color-danger)]">
      Absent
    </span>
  );
}
