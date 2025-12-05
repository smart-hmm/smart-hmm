"use client";

import Card from "@/components/ui/card";
import InfoItem from "@/components/ui/info-item";
import SummaryCard from "@/components/ui/summary-card";
import { Td, Th } from "@/components/ui/table";

export function TimeManagementDashboard() {
  return (
    <div className="space-y-6">
      {/* ================= SUMMARY KPIs ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Scheduled Hours" value="160 h / month" />
        <SummaryCard title="Actual Worked" value="154 h" />
        <SummaryCard title="Overtime" value="6 h" />
        <SummaryCard title="Time Off Used" value="8 h" />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ========== LEFT (2/3) ========== */}
        <div className="xl:col-span-2 space-y-6">
          {/* Shift History */}
          <Card title="Shift History">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-[var(--color-surface)]">
                  <tr>
                    <Th>Date</Th>
                    <Th>Shift</Th>
                    <Th>Start</Th>
                    <Th>End</Th>
                    <Th>Total Hours</Th>
                    <Th>Overtime</Th>
                  </tr>
                </thead>
                <tbody>
                  {SHIFT_DATA.map((s) => (
                    <tr key={s.date} className="border-t">
                      <Td>{s.date}</Td>
                      <Td>{s.shift}</Td>
                      <Td>{s.start}</Td>
                      <Td>{s.end}</Td>
                      <Td>{s.total}</Td>
                      <Td>
                        {s.overtime !== "-" ? (
                          <span className="text-[var(--color-success)] font-semibold">
                            {s.overtime}
                          </span>
                        ) : (
                          "-"
                        )}
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
          {/* Work Schedule */}
          <Card title="Work Schedule">
            <div className="space-y-4 text-sm">
              <InfoItem label="Shift Type" value="Morning Shift" />
              <InfoItem label="Working Days" value="Monday – Friday" />
              <InfoItem label="Start Time" value="09:00" />
              <InfoItem label="End Time" value="18:00" />
              <InfoItem label="Break Time" value="12:00 – 13:00" />
            </div>
          </Card>

          {/* Overtime Summary */}
          <Card title="Overtime Summary">
            <div className="space-y-4 text-sm">
              <InfoItem label="Total Overtime (Month)" value="6 Hours" />
              <InfoItem label="Approved Overtime" value="5 Hours" />
              <InfoItem label="Pending Approval" value="1 Hour" />
              <InfoItem label="Overtime Rate" value="1.5x Salary" />
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

interface ShiftItem {
  date: string;
  shift: string;
  start: string;
  end: string;
  total: string;
  overtime: string;
}

const SHIFT_DATA: ShiftItem[] = [
  {
    date: "2025-12-05",
    shift: "Morning",
    start: "09:00",
    end: "18:15",
    total: "9h 15m",
    overtime: "15m",
  },
  {
    date: "2025-12-04",
    shift: "Morning",
    start: "09:00",
    end: "18:00",
    total: "9h",
    overtime: "-",
  },
  {
    date: "2025-12-03",
    shift: "Morning",
    start: "09:00",
    end: "19:00",
    total: "10h",
    overtime: "1h",
  },
];
