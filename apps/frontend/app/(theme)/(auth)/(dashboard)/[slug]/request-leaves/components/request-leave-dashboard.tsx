"use client";

import Card from "@/components/ui/card";
import SummaryCard from "@/components/ui/summary-card";
import Field from "@/components/ui/field";
import { useState } from "react";


const PUBLIC_HOLIDAYS: Record<string, string> = {
  "2025-01-01": "New Year",
  "2025-04-30": "Reunification Day",
  "2025-05-01": "Labor Day",
  "2025-09-02": "National Day",
};

const getHolidayName = (date: Date) =>
  PUBLIC_HOLIDAYS[date.toISOString().split("T")[0]];


const MOCK_LEAVE_STATUS: Record<string, "approved" | "pending"> = {
  "2025-05-10": "approved",
  "2025-06-12": "pending",
};

interface CalendarDay {
  date: Date;
  label: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  isHoliday: boolean;
  holidayName?: string;
  leaveStatus?: "approved" | "pending";
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i);

export function RequestLeaveDashboard() {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [leaveDuration, setLeaveDuration] = useState<"FULL" | "AM" | "PM">(
    "FULL"
  );
  const [reason, setReason] = useState("");

  const yearCalendar = () => {
    return MONTHS.map((month) => {
      const first = new Date(currentYear, month, 1);
      const last = new Date(currentYear, month + 1, 0);
      const startWeekday = first.getDay();
      const totalDays = last.getDate();

      const days: CalendarDay[] = [];

      // Padding before
      for (let i = startWeekday - 1; i >= 0; i--) {
        const d = new Date(currentYear, month, -i);
        days.push({
          date: d,
          label: d.getDate(),
          isCurrentMonth: false,
          isWeekend: d.getDay() === 0 || d.getDay() === 6,
          isToday: d.toDateString() === today.toDateString(),
          isHoliday: !!getHolidayName(d),
          holidayName: getHolidayName(d),
          leaveStatus: MOCK_LEAVE_STATUS[
            d.toISOString().split("T")[0]
          ],
        });
      }

      // Current month
      for (let i = 1; i <= totalDays; i++) {
        const d = new Date(currentYear, month, i);
        days.push({
          date: d,
          label: i,
          isCurrentMonth: true,
          isWeekend: d.getDay() === 0 || d.getDay() === 6,
          isToday: d.toDateString() === today.toDateString(),
          isHoliday: !!getHolidayName(d),
          holidayName: getHolidayName(d),
          leaveStatus: MOCK_LEAVE_STATUS[
            d.toISOString().split("T")[0]
          ],
        });
      }

      return {
        month,
        label: first.toLocaleString("default", { month: "long" }),
        days,
      };
    });
  };

  const submitLeave = () => {
    if (!selectedDate) return;

    console.log({
      date: selectedDate,
      leaveType,
      leaveDuration,
      reason,
    });

    setSelectedDate(null);
    setReason("");
    setLeaveDuration("FULL");
  };

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard title="Annual Leave" value="15 Days" />
        <SummaryCard title="Sick Leave" value="7 Days" />
        <SummaryCard title="Pending Requests" value="1" />
        <SummaryCard title="Year" value={currentYear.toString()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {yearCalendar().length > 0 && yearCalendar().map((month) => (
          <Card key={month.month} title={`${month.label} ${currentYear}`}>
            {/* Weekdays */}
            <div className="grid grid-cols-7 text-xs mb-2 text-center font-semibold text-foreground/60">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={`${d}_${// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  i}`}>{d}</div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
              {month.days.map((day) => {
                const isSelected =
                  selectedDate?.toDateString() === day.date.toDateString();

                return (
                  <button
                    type="button"
                    key={day.date.toISOString()}
                    onClick={() => {
                      if (
                        day.isCurrentMonth &&
                        !day.isWeekend &&
                        !day.isHoliday
                      ) {
                        setSelectedDate(day.date);
                      }
                    }}
                    className={`
                      group relative h-9 flex items-center justify-center rounded-md border text-xs font-bold
                      transition-all
                      ${isSelected
                        ? "bg-primary text-white border-primary"
                        : day.isHoliday
                          ? "bg-danger text-white border-danger"
                          : day.isWeekend
                            ? "bg-accent text-black border-accent"
                            : !day.isCurrentMonth
                              ? "bg-surface opacity-30 border-muted"
                              : "hover:bg-muted cursor-pointer border-muted"
                      }
                      ${day.isToday && !isSelected
                        ? "ring-2 ring-info"
                        : ""
                      }`}
                  >
                    {day.label}

                    {day.leaveStatus && (
                      <div
                        className={`
                          absolute top-0 right-0 h-2 w-2 rounded-full
                          ${day.leaveStatus === "approved"
                            ? "bg-[var(--color-success)]"
                            : "bg-[var(--color-warning)]"
                          }
                        `}
                      />
                    )}

                    {day.isHoliday && day.holidayName && (
                      <div
                        className="
                        pointer-events-none
                        absolute -top-10 left-1/2 -translate-x-1/2
                        whitespace-nowrap
                        rounded-md bg-black px-2 py-1
                        text-[10px] text-white shadow-lg
                        opacity-0 scale-95
                        transition-all duration-200
                        group-hover:opacity-100 group-hover:scale-100
                      "
                      >
                        {day.holidayName}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-center">
              Request Leave
            </h2>

            <p className="text-center text-sm text-muted-foreground">
              {selectedDate.toDateString()}
            </p>

            <Field label="Leave Type">
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              >
                <option>Annual Leave</option>
                <option>Sick Leave</option>
                <option>Unpaid Leave</option>
                <option>Other</option>
              </select>
            </Field>

            <Field label="Leave Duration">
              <div className="grid grid-cols-3 gap-2">
                {["FULL", "AM", "PM"].map((d) => (
                  <button
                    type='button'
                    key={d}
                    onClick={() =>
                      setLeaveDuration(d as "FULL" | "AM" | "PM")
                    }
                    className={`py-2 rounded-md border font-semibold ${leaveDuration === d
                      ? "bg-primary text-white"
                      : ""
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Reason">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full rounded-md border px-3 py-2"
              />
            </Field>

            <div className="flex gap-3 pt-4">
              <button
                type='button'
                onClick={() => setSelectedDate(null)}
                className="flex-1 border rounded-md py-2"
              >
                Cancel
              </button>

              <button
                type='button'
                onClick={submitLeave}
                className="flex-1 bg-primary text-white rounded-md py-2 font-semibold"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
