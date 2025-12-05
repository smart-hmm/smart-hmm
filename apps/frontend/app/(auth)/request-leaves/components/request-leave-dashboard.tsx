"use client";

import Card from "@/components/ui/card";
import Field from "@/components/ui/field";
import SummaryCard from "@/components/ui/summary-card";
import { Td, Th } from "@/components/ui/table";
import { useMemo, useState } from "react";

type LeaveStatus = "Pending" | "Approved" | "Rejected";

interface LeaveHistoryItem {
  date: string;
  type: string;
  reason: string;
  status: LeaveStatus;
}

interface CalendarDay {
  date: Date;
  label: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
}

export function RequestLeaveDashboard() {
  const [leaveType, setLeaveType] = useState<string>("Annual Leave");
  const [reason, setReason] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo<CalendarDay[]>(() => {
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const startWeekday = first.getDay();
    const totalDays = last.getDate();

    const result: CalendarDay[] = [];

    // padding before
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      result.push({
        date: d,
        label: d.getDate(),
        isCurrentMonth: false,
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
        isToday: d.toDateString() === today.toDateString(),
      });
    }

    // current month
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      result.push({
        date: d,
        label: i,
        isCurrentMonth: true,
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
        isToday: d.toDateString() === today.toDateString(),
      });
    }

    return result;
  }, [currentMonth]);

  const handleSubmit = () => {
    if (!selectedDate) return;

    console.log({
      leaveType,
      date: selectedDate,
      reason,
    });
  };

  return (
    <div className="space-y-6">
      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Annual Leave" value="10 Days" />
        <SummaryCard title="Used" value="3 Days" />
        <SummaryCard title="Remaining" value="7 Days" />
        <SummaryCard title="Pending Requests" value="1" />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ========== LEFT (2/3) ========== */}
        <div className="xl:col-span-2 space-y-6">
          {/* Leave Calendar */}
          <Card title="Select Leave Date">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1
                    )
                  )
                }
                className="px-3 py-2 rounded-md bg-[var(--color-primary)] text-white"
              >
                ←
              </button>

              <p className="font-semibold text-sm">
                {currentMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1
                    )
                  )
                }
                className="px-3 py-2 rounded-md bg-[var(--color-primary)] text-white"
              >
                →
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-3 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="text-center text-xs font-semibold text-[var(--color-foreground)]/60"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-3">
              {days.map((day) => {
                const selected =
                  selectedDate?.toDateString() === day.date.toDateString();

                return (
                  <div
                    key={day.date.toISOString()}
                    onClick={() => {
                      if (!day.isWeekend && day.isCurrentMonth) {
                        setSelectedDate(day.date);
                      }
                    }}
                    className={`
                      h-12 flex items-center justify-center rounded-md border text-sm font-medium
                      ${
                        selected
                          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                          : day.isWeekend || !day.isCurrentMonth
                          ? "bg-[var(--color-surface)] opacity-40 border-[var(--color-muted)]"
                          : "hover:bg-[var(--color-muted)] cursor-pointer border-[var(--color-muted)]"
                      }
                      ${
                        day.isToday && !selected
                          ? "ring-2 ring-[var(--color-info)]"
                          : ""
                      }
                    `}
                  >
                    {day.label}
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-sm">
              {selectedDate
                ? `Selected Date: ${selectedDate.toDateString()}`
                : "No date selected"}
            </p>
          </Card>
        </div>

        {/* ========== RIGHT (1/3) ========== */}
        <div className="space-y-6">
          {/* Leave Request Form */}
          <Card title="Leave Request Form">
            <div className="space-y-4 text-sm">
              <Field label="Leave Type">
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full mt-1 rounded-md border border-[var(--color-muted)] px-3 py-2"
                >
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Unpaid Leave</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Selected Date">
                <input
                  value={selectedDate ? selectedDate.toDateString() : ""}
                  readOnly
                  className="w-full mt-1 rounded-md border border-[var(--color-muted)] px-3 py-2 bg-[var(--color-surface)]"
                />
              </Field>

              <Field label="Reason">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full mt-1 rounded-md border border-[var(--color-muted)] px-3 py-2"
                />
              </Field>

              <button
                onClick={handleSubmit}
                className="w-full mt-4 bg-[var(--color-primary)] text-white py-2 rounded-md font-semibold"
              >
                Submit Request
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
