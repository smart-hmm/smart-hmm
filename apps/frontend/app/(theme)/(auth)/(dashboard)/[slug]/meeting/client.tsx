"use client";

import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Link2,
  MapPin,
  Search,
  Settings,
  Share2,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Event = {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  start: string; // "13:00"
  end: string; // "14:00"
  location?: string;
  color: string;
};

const START_TIME = 10;
const END_TIME = 19;
const ROW_HEIGHT = 64; // px per hour
const MINUTES_PER_PIXEL = ROW_HEIGHT / 60; // keeps hour rows aligned with event heights
const TOTAL_ROWS = END_TIME - START_TIME + 1;
const GRID_HEIGHT = ROW_HEIGHT * TOTAL_ROWS;

const formatKey = (date: Date) => date.toISOString().slice(0, 10);

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) .. 6 (Sat)
  const mondayOffset = (day + 6) % 7; // shift so Monday is 0
  const diff = d.getDate() - mondayOffset;
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatWeekRange(start: Date) {
  const end = addDays(start, 6);
  return `${formatShortDate(start)} - ${formatShortDate(end)}`;
}

const SAMPLE_EVENTS: Event[] = [
  {
    id: "1",
    title: "Photo Session",
    date: "2025-02-18",
    start: "10:30",
    end: "12:00",
    color: "bg-purple-200 text-purple-800",
  },
  {
    id: "2",
    title: "Brain Training",
    date: "2025-02-18",
    start: "11:00",
    end: "12:00",
    color: "bg-pink-200 text-pink-800",
  },
  {
    id: "3",
    title: "Lunch",
    date: "2025-02-19",
    start: "12:00",
    end: "13:00",
    color: "bg-green-200 text-green-800",
  },
  {
    id: "4",
    title: "Lunch with Emma",
    date: "2025-02-19",
    start: "13:00",
    end: "14:00",
    color: "bg-purple-200 text-purple-800",
  },
  {
    id: "5",
    title: "Meet with @El",
    date: "2025-02-19",
    start: "13:00",
    end: "14:00",
    color: "bg-indigo-200 text-indigo-800",
  },
  {
    id: "6",
    title: "Networking Event",
    date: "2025-02-19",
    start: "14:00",
    end: "16:00",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "7",
    title: "Team Meeting",
    date: "2025-02-21",
    start: "14:00",
    end: "15:00",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "8",
    title: "Project Start",
    date: "2025-02-22",
    start: "14:00",
    end: "16:00",
    color: "bg-gray-200 text-gray-800",
  },
  {
    id: "9",
    title: "Creative Brainstorm",
    date: "2025-02-19",
    start: "16:00",
    end: "18:00",
    color: "bg-green-200 text-green-800",
  },
  {
    id: "10",
    title: "Project Development",
    date: "2025-02-19",
    start: "16:00",
    end: "17:00",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "11",
    title: "Project A",
    date: "2025-02-20",
    start: "17:00",
    end: "20:00",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "12",
    title: "Project Review",
    date: "2025-02-21",
    start: "17:00",
    end: "18:00",
    color: "bg-purple-200 text-purple-800",
  },
];

function minutesFromStart(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h - START_TIME) * 60 + m;
}

function EventBlock({ event }: { event: Event }) {
  const top = minutesFromStart(event.start) * MINUTES_PER_PIXEL;
  const height =
    (minutesFromStart(event.end) - minutesFromStart(event.start)) *
    MINUTES_PER_PIXEL;

  return (
    <div
      className={`absolute left-1 right-1 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm ${event.color}`}
      style={{ top, height }}
    >
      <div className="text-[11px] opacity-75">
        {event.start} - {event.end}
      </div>
      <div className="truncate">{event.title}</div>
    </div>
  );
}

export default function MeetingClient() {
  const [selectedColor, setSelectedColor] = useState("#8b5cf6");
  const [anchorDate, setAnchorDate] = useState(() => new Date()); // default to today
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isWeekOpen, setIsWeekOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  const monthPopoverRef = useRef<HTMLDivElement | null>(null);
  const weekPopoverRef = useRef<HTMLDivElement | null>(null);
  const yearPopoverRef = useRef<HTMLDivElement | null>(null);

  const weekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate]);

  const visibleDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const weekOptions = useMemo(() => {
    return Array.from({ length: 5 }, (_, idx) => {
      const offset = idx - 2; // two weeks back to two weeks forward
      const start = addDays(weekStart, offset * 7);
      return {
        label: formatWeekRange(start),
        start,
        isCurrent: offset === 0,
      };
    });
  }, [weekStart]);

  const midWeek = useMemo(() => addDays(weekStart, 3), [weekStart]);
  const monthLabel = useMemo(
    () =>
      midWeek.toLocaleDateString("en-US", {
        month: "long",
      }),
    [midWeek]
  );
  const yearLabel = midWeek.getFullYear();

  const eventsByDay = useMemo(() => {
    const map: Record<string, Event[]> = {};
    visibleDays.forEach((day) => {
      map[formatKey(day)] = [];
    });

    SAMPLE_EVENTS.forEach((ev) => {
      if (map[ev.date]) {
        map[ev.date].push(ev);
      }
    });

    Object.keys(map).forEach((key) => {
      map[key] = map[key].sort((a, b) => a.start.localeCompare(b.start));
    });

    return map;
  }, [visibleDays]);

  const timeLabels = useMemo(() => {
    const labels: string[] = [];
    for (let h = START_TIME; h <= END_TIME; h++) {
      const label = `${((h + 11) % 12) + 1} ${h >= 12 ? "PM" : "AM"}`;
      labels.push(label);
    }
    return labels;
  }, []);

  useEffect(() => {
    // Scroll to mid-day by default so events are visible without manual scroll
    if (gridScrollRef.current) {
      gridScrollRef.current.scrollTop = ROW_HEIGHT * 1.5;
    }
  }, [anchorDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMonthOpen &&
        monthPopoverRef.current &&
        !monthPopoverRef.current.contains(event.target as Node)
      ) {
        setIsMonthOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMonthOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isWeekOpen &&
        weekPopoverRef.current &&
        !weekPopoverRef.current.contains(event.target as Node)
      ) {
        setIsWeekOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isWeekOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isYearOpen &&
        yearPopoverRef.current &&
        !yearPopoverRef.current.contains(event.target as Node)
      ) {
        setIsYearOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isYearOpen]);

  return (
    <div className="min-h-screen bg-[#f8f7fb] text-[#1f1f2d]">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button
              onClick={() => setAnchorDate(new Date())}
              className="rounded-full bg-white px-3 py-1 shadow-sm flex items-center gap-2 transition hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4" />
              <span>Today</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  aria-label="Select month"
                  className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm hover:bg-gray-50"
                  onClick={() => setIsMonthOpen((prev) => !prev)}
                >
                  <span className="text-sm font-semibold">{monthLabel}</span>
                  <ChevronDownIcon />
                </button>
                {isMonthOpen && (
                  <div
                    ref={monthPopoverRef}
                    className="absolute left-0 top-full z-50 mt-2 w-44 rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
                  >
                    {Array.from({ length: 12 }).map((_, idx) => {
                      const monthName = new Date(2000, idx, 1).toLocaleString(
                        "en-US",
                        { month: "long" }
                      );
                      const isActive = anchorDate.getMonth() === idx;
                      return (
                        <button
                          key={monthName}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${
                            isActive ? "bg-gray-100 font-semibold" : ""
                          }`}
                          onClick={() => {
                            const day = Math.min(
                              anchorDate.getDate(),
                              daysInMonth(anchorDate.getFullYear(), idx)
                            );
                            setAnchorDate(
                              new Date(anchorDate.getFullYear(), idx, day)
                            );
                            setIsMonthOpen(false);
                          }}
                        >
                          <span>{monthName}</span>
                          {isActive && <Check className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm">
                <button
                  aria-label="Previous week"
                  className="rounded-full p-1 hover:bg-gray-100"
                  onClick={() => setAnchorDate((prev) => addDays(prev, -7))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  aria-label="Next week"
                  className="rounded-full p-1 hover:bg-gray-100"
                  onClick={() => setAnchorDate((prev) => addDays(prev, 7))}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative">
              <button
                className="rounded-full bg-white px-3 py-1 shadow-sm hover:bg-gray-50 flex items-center gap-2"
                onClick={() => setIsYearOpen((prev) => !prev)}
              >
                <span>{yearLabel}</span>
                <ChevronDownIcon />
              </button>
              {isYearOpen && (
                <div
                  ref={yearPopoverRef}
                  className="absolute left-0 top-full z-50 mt-2 w-32 rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
                >
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const year = yearLabel - 3 + idx;
                    const isActive = year === yearLabel;
                    return (
                      <button
                        key={year}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${
                          isActive ? "bg-gray-100 font-semibold" : ""
                        }`}
                        onClick={() => {
                          setAnchorDate(
                            new Date(
                              year,
                              anchorDate.getMonth(),
                              Math.min(
                                anchorDate.getDate(),
                                daysInMonth(year, anchorDate.getMonth())
                              )
                            )
                          );
                          setIsYearOpen(false);
                        }}
                      >
                        <span>{year}</span>
                        {isActive && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm hover:bg-gray-50"
              onClick={() => setIsWeekOpen((prev) => !prev)}
            >
              Week <ChevronDownIcon />
            </button>
            {isWeekOpen && (
              <div
                ref={weekPopoverRef}
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
              >
                {weekOptions.map((opt) => (
                  <button
                    key={opt.label}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${
                      opt.isCurrent ? "bg-gray-100 font-semibold" : ""
                    }`}
                    onClick={() => {
                      setAnchorDate(opt.start);
                      setIsWeekOpen(false);
                    }}
                  >
                    <span>{opt.label}</span>
                    {opt.isCurrent && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
            <Search className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 rounded-full bg-[#3b82f6] px-4 py-2 text-white shadow-sm">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
            <Settings className="h-4 w-4" />
          </button>
          <button
            className="flex items-center gap-2 rounded-full bg-[#3b82f6] px-4 py-2 text-white shadow-sm"
            onClick={() => setShowCreate(true)}
          >
            + Create Meeting
          </button>
          <button className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
            <img
              src="https://i.pravatar.cc/32?img=5"
              alt="User avatar"
              className="h-8 w-8 rounded-full"
            />
          </button>
        </div>
      </div>
      <div className="px-6 pb-8">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div
            className="grid items-center border-b border-gray-100 bg-white px-3 py-2 text-sm font-semibold text-gray-700"
            style={{
              gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))`,
            }}
          >
            {visibleDays.map((day) => (
              <div key={day.toISOString()} className="text-center">
                {day.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                })}
              </div>
            ))}
          </div>

          <div
            ref={gridScrollRef}
            className="mt-2 flex overflow-auto rounded-xl border border-gray-100 bg-white"
            style={{ height: GRID_HEIGHT + 48 }}
          >
            {/* Time column */}
            <div className="sticky left-0 z-10 flex w-[70px] flex-col items-end bg-white pr-3 text-[11px] text-gray-500">
              {timeLabels.map((label) => (
                <div
                  key={label}
                  className="flex items-start justify-end"
                  style={{ height: ROW_HEIGHT }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="min-w-[980px] flex-1">
              <div
                className="relative grid gap-3 px-3 pb-3 pt-1"
                style={{
                  height: GRID_HEIGHT + 12,
                  gridTemplateColumns: `repeat(${visibleDays.length}, minmax(0, 1fr))`,
                }}
              >
                {visibleDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className="relative h-full rounded-xl border border-gray-100 bg-white overflow-hidden"
                  >
                    <div className="absolute inset-0">
                      {timeLabels.map((_, idx) => (
                        <div
                          key={idx}
                          className="border-b border-dashed border-gray-100"
                          style={{ height: ROW_HEIGHT }}
                        />
                      ))}
                    </div>

                    <div className="relative h-full">
                      {eventsByDay[formatKey(day)]?.map((event) => (
                        <EventBlock key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Meeting Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition ${
          showCreate ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            showCreate ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setShowCreate(false)}
        />
        <div
          className={`relative w-full max-w-[520px] transform rounded-2xl border border-gray-100 bg-white shadow-2xl transition duration-300 ${
            showCreate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="text-base font-semibold">Create Meeting</h3>
              <button
                className="rounded-full p-2 hover:bg-gray-100"
                onClick={() => setShowCreate(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <input
                  defaultValue="Meet!"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[#3b82f6]"
                />
                <button className="rounded-full bg-white p-2 shadow-sm">
                  <MoreIcon />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">Thursday, 18 September</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <label className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs sm:text-sm">
                  <input type="radio" name="time" defaultChecked />
                  <span>3:00</span>
                </label>
                <label className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs sm:text-sm">
                  <input type="radio" name="time" />
                  <span>4:00</span>
                </label>
                <label className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs sm:text-sm">
                  <input type="checkbox" /> All day
                </label>
                <label className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs sm:text-sm">
                  <input type="checkbox" /> Yearly
                </label>
              </div>

              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500">Add participant</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/32?img=12"
                  alt="Nazmi"
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">Nazmi Javier</p>
                  <p className="flex items-center gap-1 text-xs text-gray-500">
                    <span
                      className="inline-block h-2 w-2 rounded-full bg-emerald-500"
                      aria-hidden
                    />
                    Available
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/32?img=32"
                  alt="Emilia"
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold">Emilia Inder</p>
                  <p className="flex items-center gap-1 text-xs text-orange-500">
                    <span
                      className="inline-block h-2 w-2 rounded-full bg-orange-400"
                      aria-hidden
                    />
                    Maybe
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-gray-500" />
                <input
                  defaultValue="https://meet.google.com/zp-srsk-kxf"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <input
                  defaultValue="Jakarta, Indonesia"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                You're invited to join our Google Meet session for an important
                discussion.
                <br />
                <br />
                Link: https://meet.google.com/zp-srsk-kxf
                <br />
                <br />
                We look forward to your participation!
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Add Reminders</span>
                  <button className="text-xs font-semibold text-[#3b82f6]">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#f97316",
                    "#f59e0b",
                    "#fde047",
                    "#22c55e",
                    "#22d3ee",
                    "#3b82f6",
                    "#8b5cf6",
                    "#e879f9",
                    "#f472b6",
                    "#ef4444",
                    "#9ca3af",
                  ].map((color) => (
                    <button
                      key={color}
                      className="h-7 w-7 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Reminder color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <button className="flex w-full items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">
                <Bell className="h-4 w-4" />
                Reminder at 3 PM
              </button>
            </div>

            <div className="flex items-center justify-between border-t px-5 py-4">
              <button
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowCreate(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-gray-500"
    >
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </svg>
  );
}
