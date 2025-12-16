"use client";

import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Search,
  Settings,
  Share2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Event = {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  start: string; // "13:00"
  end: string; // "14:00"
  location?: string;
  invitedMemberIds: string[];
  creatorId: string;
  color: string;
  description?: string;
  tags?: { label: string; color?: string }[];
  meetingCost?: string;
  priority?: "Low" | "Medium" | "High";
  objective?: string;
  finishCriteria?: string;
  nextSteps?: { label: string; done: boolean }[];
  resources?: { label: string; type: "kanban" | "doc" | "design" | "link" }[];
  schedule?: { time: string; title: string }[];
  participants?: { name: string; avatar: string }[];
};

type TimeFormat = "12h" | "24h";

const START_TIME = 0;
const END_TIME = 23;
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

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function formatFullDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const SAMPLE_EVENTS: Event[] = [
  {
    id: "1",
    title: "Photo Session",
    date: "2025-02-18",
    start: "10:30",
    end: "12:00",
    invitedMemberIds: ["member-2", "member-3"],
    creatorId: "member-1",
    color: "bg-purple-200 text-purple-800",
    description:
      "We are introducing the new design tokens for the app. They are set so they can be added in light and dark mode, and can be switched with the new variables.",
    tags: [
      { label: "Product Designers", color: "#f5d0fe" },
      { label: "Design System", color: "#e0f2fe" },
    ],
    meetingCost: "8h",
    priority: "Low",
    objective:
      "Every design system member knows about the design tokens and how to apply them.",
    finishCriteria:
      "When every team member understands the value of using tokens and how to apply them in the different products.",
    nextSteps: [
      { label: "@felipecardona to review the implementation in Mobile", done: true },
      { label: "Publish the library to the team", done: false },
      { label: "Make post in the newsletter", done: false },
    ],
    resources: [
      { label: "Kanban Board", type: "kanban" },
      { label: "Documentation", type: "doc" },
      { label: "Design File", type: "design" },
    ],
    schedule: [
      { time: "10 min", title: "Introduction to design tokens" },
      { time: "20 min", title: "Review new components" },
      { time: "30 min", title: "Q&A and adoption plan" },
    ],
    participants: [
      { name: "Emma", avatar: "https://i.pravatar.cc/48?img=12" },
      { name: "Liam", avatar: "https://i.pravatar.cc/48?img=14" },
      { name: "Ava", avatar: "https://i.pravatar.cc/48?img=15" },
      { name: "Mia", avatar: "https://i.pravatar.cc/48?img=16" },
      { name: "Noah", avatar: "https://i.pravatar.cc/48?img=17" },
    ],
  },
  {
    id: "2",
    title: "Brain Training",
    date: "2025-02-18",
    start: "11:00",
    end: "12:00",
    invitedMemberIds: ["member-4", "member-6"],
    creatorId: "member-2",
    color: "bg-pink-200 text-pink-800",
    tags: [{ label: "Workshop", color: "#fee2e2" }],
    priority: "Medium",
  },
  {
    id: "3",
    title: "Lunch",
    date: "2025-02-19",
    start: "12:00",
    end: "13:00",
    invitedMemberIds: ["member-1", "member-5"],
    creatorId: "member-3",
    color: "bg-green-200 text-green-800",
    tags: [{ label: "Social", color: "#dcfce7" }],
    priority: "Low",
  },
  {
    id: "4",
    title: "Lunch with Emma",
    date: "2025-02-19",
    start: "13:00",
    end: "14:00",
    invitedMemberIds: ["member-7", "member-8"],
    creatorId: "member-4",
    color: "bg-purple-200 text-purple-800",
    priority: "Low",
  },
  {
    id: "5",
    title: "Meet with @El",
    date: "2025-02-19",
    start: "13:00",
    end: "14:00",
    invitedMemberIds: ["member-9", "member-10"],
    creatorId: "member-5",
    color: "bg-indigo-200 text-indigo-800",
    priority: "Medium",
  },
  {
    id: "6",
    title: "Networking Event",
    date: "2025-02-19",
    start: "14:00",
    end: "16:00",
    invitedMemberIds: ["member-2", "member-4", "member-11"],
    creatorId: "member-6",
    color: "bg-indigo-100 text-indigo-700",
    priority: "High",
  },
  {
    id: "7",
    title: "Team Meeting",
    date: "2025-02-21",
    start: "14:00",
    end: "15:00",
    invitedMemberIds: ["member-1", "member-3", "member-6"],
    creatorId: "member-2",
    color: "bg-purple-100 text-purple-700",
    priority: "Medium",
  },
  {
    id: "8",
    title: "Project Start",
    date: "2025-02-22",
    start: "14:00",
    end: "16:00",
    invitedMemberIds: ["member-5", "member-7", "member-9"],
    creatorId: "member-8",
    color: "bg-gray-200 text-gray-800",
    priority: "High",
  },
  {
    id: "9",
    title: "Creative Brainstorm",
    date: "2025-02-19",
    start: "16:00",
    end: "18:00",
    invitedMemberIds: ["member-10", "member-12"],
    creatorId: "member-9",
    color: "bg-green-200 text-green-800",
    priority: "Medium",
  },
  {
    id: "10",
    title: "Project Development",
    date: "2025-02-19",
    start: "16:00",
    end: "17:00",
    invitedMemberIds: ["member-4", "member-8"],
    creatorId: "member-10",
    color: "bg-purple-100 text-purple-700",
    priority: "Medium",
  },
  {
    id: "11",
    title: "Project A",
    date: "2025-02-20",
    start: "17:00",
    end: "20:00",
    invitedMemberIds: ["member-2", "member-5", "member-9"],
    creatorId: "member-1",
    color: "bg-blue-100 text-blue-700",
    priority: "High",
  },
  {
    id: "12",
    title: "Project Review",
    date: "2025-02-21",
    start: "17:00",
    end: "18:00",
    invitedMemberIds: ["member-3", "member-6"],
    creatorId: "member-2",
    color: "bg-purple-200 text-purple-800",
    priority: "High",
  },
];

function minutesFromStart(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h - START_TIME) * 60 + m;
}

function formatTimeLabel(hour: number, format: TimeFormat) {
  if (format === "24h") {
    return `${hour.toString().padStart(2, "0")}:00`;
  }
  const twelveHour = ((hour + 11) % 12) + 1;
  const period = hour >= 12 ? "PM" : "AM";
  return `${twelveHour} ${period}`;
}

function formatTimeForDisplay(time: string, format: TimeFormat) {
  if (format === "24h") return time;
  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);
  const twelveHour = hour % 12 || 12;
  const period = hour >= 12 ? "PM" : "AM";
  return `${twelveHour}:${minute} ${period}`;
}

function EventBlock({
  event,
  format,
  onClick,
}: {
  event: Event;
  format: TimeFormat;
  onClick?: (event: Event) => void;
}) {
  const top = minutesFromStart(event.start) * MINUTES_PER_PIXEL;
  const height =
    (minutesFromStart(event.end) - minutesFromStart(event.start)) *
    MINUTES_PER_PIXEL;

  return (
    <div
      className={`absolute left-1 right-1 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-primary)]/40 ${event.color}`}
      style={{ top, height }}
      onClick={() => onClick?.(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(event);
        }
      }}
    >
      <div className="text-[11px] opacity-75">
        {formatTimeForDisplay(event.start, format)} -{" "}
        {formatTimeForDisplay(event.end, format)}
      </div>
      <div className="truncate">{event.title}</div>
    </div>
  );
}

export default function MeetingClient() {
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12h");
  const [anchorDate, setAnchorDate] = useState(() => new Date()); // default to today
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isWeekOpen, setIsWeekOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const params = useParams<{ slug: string }>();
  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  const monthPopoverRef = useRef<HTMLDivElement | null>(null);
  const weekPopoverRef = useRef<HTMLDivElement | null>(null);
  const yearPopoverRef = useRef<HTMLDivElement | null>(null);
  const createHref = params?.slug ? `/${params.slug}/meeting/create` : "/meeting/create";

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
      labels.push(formatTimeLabel(h, timeFormat));
    }
    return labels;
  }, [timeFormat]);

  useEffect(() => {
    // Scroll to mid-day by default so events are visible without manual scroll
    if (gridScrollRef.current) {
      gridScrollRef.current.scrollTop = ROW_HEIGHT * 4;
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
                    className="popover-animate absolute left-0 top-full z-50 mt-2 w-44 rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
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
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${isActive ? "bg-gray-100 font-semibold" : ""
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
                  className="popover-animate absolute left-0 top-full z-50 mt-2 w-32 rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
                >
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const year = yearLabel - 3 + idx;
                    const isActive = year === yearLabel;
                    return (
                      <button
                        key={year}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${isActive ? "bg-gray-100 font-semibold" : ""
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
                className="popover-animate absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
              >
                {weekOptions.map((opt) => (
                  <button
                    key={opt.label}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-gray-100 ${opt.isCurrent ? "bg-gray-100 font-semibold" : ""
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
          <button className="flex items-center gap-2 rounded-full bg-[color:var(--theme-primary)] px-4 py-2 text-white shadow-sm">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
            <Settings className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow-sm">
            {(["12h", "24h"] as const).map((format) => (
              <button
                key={format}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${timeFormat === format
                  ? "bg-[color:var(--theme-primary)] text-white"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => setTimeFormat(format)}
              >
                {format === "12h" ? "12h (AM/PM)" : "24h"}
              </button>
            ))}
          </div>
          <Link
            href={createHref}
            className="flex items-center gap-2 rounded-full bg-[color:var(--theme-primary)] px-4 py-2 text-white shadow-sm"
          >
            + Create Meeting
          </Link>
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
                <div
                  className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-xs font-semibold ${
                    isWeekend(day) ? "bg-red-50 text-red-600" : "text-gray-700"
                  }`}
                >
                  <span>{day.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className="text-sm">{day.getDate()}</span>
                </div>
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
                {visibleDays.map((day) => {
                  const weekend = isWeekend(day);
                  return (
                    <div
                      key={day.toISOString()}
                      className={`relative h-full rounded-xl border overflow-hidden ${
                        weekend ? "border-red-100 bg-red-50/50" : "border-gray-100 bg-white"
                      }`}
                    >
                      <div className="absolute inset-0">
                        {timeLabels.map((_, idx) => (
                          <div
                            key={idx}
                            className={`border-b border-dashed ${
                              weekend ? "border-red-100" : "border-gray-100"
                            }`}
                            style={{ height: ROW_HEIGHT }}
                          />
                        ))}
                      </div>

                      <div className="relative h-full">
                        {eventsByDay[formatKey(day)]?.map((event) => (
                          <EventBlock
                            key={event.id}
                            event={event}
                            format={timeFormat}
                            onClick={(ev) => {
                              setSelectedEvent(ev);
                              setShowEventDetails(true);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition ${showEventDetails ? "pointer-events-auto" : "pointer-events-none"
          }`}
      >
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${showEventDetails ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
        />
        <div
          className={`relative w-full max-w-[760px] max-h-[85vh] transform overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl transition duration-300 ${showEventDetails
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
            }`}
        >
          <div className="flex h-full min-h-0 flex-col">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
              <h3 className="text-base font-semibold">
                {selectedEvent?.title ?? "Meeting Details"}
              </h3>
              <div className="flex items-center gap-2">
                <button className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                  Edit
                </button>
                <button
                  className="rounded-full p-2 hover:bg-gray-100"
                  onClick={() => {
                    setShowEventDetails(false);
                    setSelectedEvent(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 space-y-5 overflow-y-auto px-5 py-5 text-sm text-gray-700">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-[#1f1f2d]">
                    {selectedEvent?.title}
                  </h2>
                  <div className="rounded-2xl bg-gray-50 px-4 py-3">
                    <h4 className="text-sm font-semibold text-[#1f1f2d]">
                      Description
                    </h4>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {selectedEvent?.description ?? "No description provided yet."}
                    </p>
                  </div>
                  {selectedEvent?.tags?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className="rounded-full px-3 py-1 text-[11px] font-semibold text-[#1f1f2d]"
                          style={{
                            backgroundColor: tag.color ?? "#f3f4f6",
                          }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#1f1f2d]">
                    {selectedEvent
                      ? `${Math.max(
                        1,
                        Math.round(
                          (minutesFromStart(selectedEvent.end) -
                            minutesFromStart(selectedEvent.start)) /
                          60
                        )
                      )}h`
                      : "—"}
                  </div>
                </div>
              </div>

              {selectedEvent?.participants?.length ? (
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {selectedEvent.participants.map((p) => (
                      <img
                        key={p.name}
                        src={p.avatar}
                        alt={p.name}
                        className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-semibold">
                      {selectedEvent ? formatFullDate(selectedEvent.date) : "—"}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#1f1f2d]">
                    {selectedEvent
                      ? `${formatTimeForDisplay(
                        selectedEvent.start,
                        timeFormat
                      )} - ${formatTimeForDisplay(
                        selectedEvent.end,
                        timeFormat
                      )}`
                      : "—"}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-semibold">meeting cost</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#1f1f2d]">
                    {selectedEvent?.meetingCost ?? "—"}
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Settings className="h-4 w-4" />
                    <span className="text-xs font-semibold">Priority</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#1f1f2d]">
                    {selectedEvent?.priority ?? "—"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <h4 className="text-sm font-semibold text-[#1f1f2d]">
                  Objective
                </h4>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  {selectedEvent?.objective ?? "No objective provided yet."}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 px-4 py-3">
                <h4 className="text-sm font-semibold text-[#1f1f2d]">
                  When does the meeting finish?
                </h4>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  {selectedEvent?.finishCriteria ??
                    "No finish criteria provided yet."}
                </p>
              </div>

              {selectedEvent?.nextSteps?.length ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#1f1f2d]">
                    Next steps
                  </h4>
                  <div className="space-y-2">
                    {selectedEvent.nextSteps.map((step) => (
                      <label
                        key={step.label}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={step.done}
                          readOnly
                          className="h-4 w-4 rounded border-gray-300 text-[color:var(--theme-primary)]"
                        />
                        <span className={step.done ? "line-through text-gray-500" : ""}>
                          {step.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedEvent?.resources?.length ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#1f1f2d]">
                    Resources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.resources.map((res) => (
                      <span
                        key={res.label}
                        className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm"
                      >
                        <ResourceIcon type={res.type} />
                        {res.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedEvent?.schedule?.length ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#1f1f2d]">
                    Schedule
                  </h4>
                  <ul className="space-y-2">
                    {selectedEvent.schedule.map((item) => (
                      <li key={`${item.time}-${item.title}`} className="flex gap-2">
                        <span className="text-xs font-semibold text-gray-500">
                          {item.time}
                        </span>
                        <span className="text-sm text-gray-700">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .popover-animate {
          animation: popoverIn 160ms ease-out;
          transform-origin: top center;
        }

        @keyframes popoverIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
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

function ResourceIcon({ type }: { type: "kanban" | "doc" | "design" | "link" }) {
  const iconMap: Record<string, string> = {
    kanban: "🗂️",
    doc: "📄",
    design: "🎨",
    link: "🔗",
  };
  return <span aria-hidden>{iconMap[type] ?? "🔗"}</span>;
}
