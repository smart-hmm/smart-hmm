"use client";

import { useMemo, useState } from "react";

interface CalendarDay {
  date: Date;
  label: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
}

interface Props {
  value: Date | null;
  onChange: (d: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function LeaveCalendar({ value, onChange }: Props) {
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

    // Previous month padding
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

    // Current month days
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

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4 mt-4">
        <button
          type="button"
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
              )
            )
          }
          className="px-3 py-2 rounded-md bg-primary text-surface"
        >
          ←
        </button>

        <p className="font-semibold text-base">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </p>

        <button
          type="button"
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
              )
            )
          }
          className="px-3 py-2 rounded-md bg-primary text-surface"
        >
          →
        </button>
      </div>

      {/* ✅ Day of Week Header */}
      <div className="grid grid-cols-7 gap-3 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-[var(--color-foreground)]/70"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((day) => {
          const selected = value?.toDateString() === day.date.toDateString();

          return (
            <div
              key={day.date.toISOString()}
              onClick={() => {
                if (!day.isWeekend && day.isCurrentMonth) {
                  onChange(day.date);
                }
              }}
              className={`
                h-12 flex items-center justify-center rounded-md border text-base font-medium
                ${
                  selected
                    ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                    : day.isWeekend || !day.isCurrentMonth
                    ? "bg-surface opacity-40 border-surface"
                    : "hover:bg-[var(--color-muted)] cursor-pointer border-surface"
                }
                ${day.isToday && !selected ? "ring-2 ring-primary" : ""}
              `}
            >
              {day.label}
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-sm text-foreground/70 mb-5">
        <span className="inline-block w-3 h-3 rounded-full ring-2 ring-primary mr-2 align-middle" />
        Today
      </div>
    </div>
  );
}
