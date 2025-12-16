"use client";

import { useMe } from "@/services/react-query/queries/use-me";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type MetricCard = {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: string;
  tint: string;
};

type Person = {
  name: string;
  title: string;
  id: string;
  type: "Full Time" | "Contractor";
  status: "Active" | "Inactive";
  avatar: string;
};

type Reminder = {
  title: string;
  range: string;
  dayLabel: string;
  avatars: string[];
};

type Meeting = {
  id: string;
  host: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  timeZoneLabel: string;
  meetingLink: string;
  avatar: string;
  date: Date;
};

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const mondayOffset = (day + 6) % 7;
  d.setDate(d.getDate() - mondayOffset);
  return d;
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function buildCalendarWeeks(anchor: Date) {
  const start = startOfWeekMonday(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
  const weeks: Date[][] = [];
  let cursor = start;
  while (cursor.getMonth() === anchor.getMonth() || weeks.length < 5) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++) {
      row.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(row);
    if (cursor.getMonth() > anchor.getMonth() && cursor.getDate() >= 7) break;
  }
  return weeks;
}

function formatTimeRange(date: Date, startHour: number, endHour: number) {
  const start = new Date(date);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(date);
  end.setHours(endHour, 0, 0, 0);
  const dayMonth = start.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  const time = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${dayMonth} ${time(start)} - ${time(end)}`;
}

function formatTimeZoneLabel(date: Date, hour: number) {
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  const base = d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  });
  return `${base} Pacific Time (US and Canada)`;
}

function buildMeetings(baseDate: Date): Meeting[] {
  return [
    {
      id: "1",
      host: "David Watson",
      title: "YC S25 / Rho / Pally Dinner",
      subtitle: "Join fintech leaders and founders to discuss RHO's sales strategy and product updates.",
      timeLabel: formatTimeRange(addDays(baseDate, 0), 3, 4),
      timeZoneLabel: formatTimeZoneLabel(addDays(baseDate, 0), 12),
      meetingLink: "#",
      avatar: "https://i.pravatar.cc/48?img=12",
      date: addDays(baseDate, 0),
    },
    {
      id: "2",
      host: "Jessica Parker",
      title: "SaaS Growth & Marketing Roundtable",
      subtitle: "A focused session with Jessica Parker to dive into BrightTech Solutions' growth levers.",
      timeLabel: formatTimeRange(addDays(baseDate, 1), 2, 3),
      timeZoneLabel: formatTimeZoneLabel(addDays(baseDate, 1), 12),
      meetingLink: "#",
      avatar: "https://i.pravatar.cc/48?img=31",
      date: addDays(baseDate, 1),
    },
    {
      id: "3",
      host: "David Watson",
      title: "Fintech Founders Meetup",
      subtitle: "Connect with Steve Rogers to learn about his new payment rails and potential partnership.",
      timeLabel: formatTimeRange(addDays(baseDate, 2), 1, 2),
      timeZoneLabel: formatTimeZoneLabel(addDays(baseDate, 2), 12),
      meetingLink: "#",
      avatar: "https://i.pravatar.cc/48?img=15",
      date: addDays(baseDate, 2),
    },
  ];
}

export default function DashboardHomePage() {
  const { data: userInfo } = useMe();
  const [calendarMonth, setCalendarMonth] = useState(() => startOfWeekMonday(new Date()));
  const [meetingAnchorDate, setMeetingAnchorDate] = useState(() => startOfWeekMonday(new Date()));
  const [meetingSelectedDate, setMeetingSelectedDate] = useState(() => startOfWeekMonday(new Date()));

  const metrics: MetricCard[] = [
    { label: "Total People", value: "324", delta: "+12.32%", positive: true, icon: "👥", tint: "bg-cyan-50" },
    { label: "Attendance", value: "230", delta: "+12.32%", positive: true, icon: "📅", tint: "bg-pink-50" },
    { label: "New Joined People", value: "10", delta: "-02.12%", positive: false, icon: "🧑‍💻", tint: "bg-violet-50" },
    { label: "Time Tracking Snapshot", value: "3456 hrs", delta: "+12.32%", positive: true, icon: "⏱️", tint: "bg-amber-50" },
  ];

  const payroll = {
    period: "August 1-15",
    status: "In Progress",
    paid: 24,
    total: 30,
    amount: "$75,200",
  };

  const attendanceTrend = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    present: [80, 82, 79, 85, 83, 78, 80],
    absent: [8, 7, 9, 6, 7, 10, 9],
    late: [12, 11, 12, 9, 10, 12, 11],
  };

  const recentPeople: Person[] = [
    {
      name: "Jenny Wilson",
      title: "Employee",
      id: "124562",
      type: "Full Time",
      status: "Active",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
    {
      name: "Eleanor Pena",
      title: "Employee",
      id: "124562",
      type: "Full Time",
      status: "Active",
      avatar: "https://i.pravatar.cc/40?img=16",
    },
    {
      name: "Floyd Miles",
      title: "Contractor",
      id: "124562",
      type: "Full Time",
      status: "Inactive",
      avatar: "https://i.pravatar.cc/40?img=22",
    },
    {
      name: "Esther Howard",
      title: "Employee",
      id: "124562",
      type: "Full Time",
      status: "Active",
      avatar: "https://i.pravatar.cc/40?img=10",
    },
    {
      name: "Jacob Jones",
      title: "Contractor",
      id: "124562",
      type: "Full Time",
      status: "Active",
      avatar: "https://i.pravatar.cc/40?img=30",
    },
  ];

  const calendarWeeks = useMemo(() => buildCalendarWeeks(calendarMonth), [calendarMonth]);
  const meetingCalendar = useMemo(() => {
    const todayString = new Date().toDateString();
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(meetingAnchorDate, i);
      const isToday = d.toDateString() === todayString;
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      return {
        label: formatDayLabel(d),
        date: d.getDate().toString().padStart(2, "0"),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        fullDate: d,
        isToday,
        isWeekend,
      };
    });
    const upcomingMeetings = buildMeetings(meetingAnchorDate);
    const filteredMeetings = upcomingMeetings.filter(
      (m) => m.date.toDateString() === meetingSelectedDate.toDateString()
    );
    return { weekDays, filteredMeetings };
  }, [meetingAnchorDate, meetingSelectedDate]);

  return (
    <div className="min-h-screen bg-[#f5f3fb] text-[#1f1f2d]">
      <div className="mx-auto w-full px-6 py-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">
            Welcome back, {userInfo?.employee.lastName ?? "Alexiso"}!
          </h1>
          <p className="text-sm text-gray-600">Here&apos;s your snapshot for today.</p>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 flex items-center gap-3"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${metric.tint}`}>
                <span className="text-lg">{metric.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">{metric.label}</span>
                <span className="text-xl font-semibold">{metric.value}</span>
                <span className={`text-xs font-semibold ${metric.positive ? "text-emerald-600" : "text-red-600"}`}>
                  {metric.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr,1.7fr]">
          <div className="rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] p-5 text-white shadow-lg">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">Payroll Overview</p>
                <p className="text-sm font-semibold">{payroll.period}</p>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                {payroll.status}
              </span>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-white/80">Employees Paid</p>
              <p className="text-3xl font-bold">{payroll.amount}</p>
              <p className="text-xs text-white/80">
                {payroll.paid} / {payroll.total}
              </p>
            </div>
            <button type="button" className="mt-6 w-full rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#5b21b6] shadow">
              Finish Payroll
            </button>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">People & Attendance</p>
                <p className="text-base font-semibold text-[#1f1f2d]">This week</p>
              </div>
              <button type="button" className="rounded-full p-2 text-gray-400 hover:bg-gray-100" aria-label="More">
                ⋮
              </button>
            </div>
            <div className="mt-4 h-48 rounded-2xl bg-gradient-to-b from-white to-gray-50 p-4">
              <AttendanceChart trend={attendanceTrend} />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[#1f1f2d]">Recent People</h3>
              <button type="button" className="text-xs font-semibold text-[color:var(--theme-primary)]">View all</button>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-gray-500">
                  <tr className="[&>th]:py-2 [&>th]:pr-4">
                    <th className="min-w-[180px]">Employee Name</th>
                    <th>Title</th>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th className="text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentPeople.map((person) => (
                    <tr key={person.name} className="text-sm text-[#1f1f2d]">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={person.avatar}
                            alt={person.name}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <span className="font-semibold">{person.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{person.title}</td>
                      <td className="py-3 pr-4 text-gray-600">{person.id}</td>
                      <td className="py-3 pr-4 text-gray-600">{person.type}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${person.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                            }`}
                        >
                          {person.status}
                        </span>
                      </td>
                      <td className="py-3 pr-2">
                        <div className="flex justify-end gap-2 text-gray-400">
                          <button type="button" className="hover:text-[#1f1f2d]" aria-label="Edit">
                            ✏️
                          </button>
                          <button type="button" className="hover:text-[#1f1f2d]" aria-label="View">
                            👁️
                          </button>
                          <button type="button" className="hover:text-red-500" aria-label="Delete">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1f1f2d]">Upcoming meetings</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1">
                <button
                  type="button"
                  className="rounded-full p-1 hover:bg-gray-50"
                  onClick={() => {
                    const next = addDays(meetingAnchorDate, -7);
                    setMeetingAnchorDate(next);
                    setMeetingSelectedDate(next);
                  }}
                  aria-label="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-full p-1 hover:bg-gray-50"
                  onClick={() => {
                    const next = addDays(meetingAnchorDate, 7);
                    setMeetingAnchorDate(next);
                    setMeetingSelectedDate(next);
                  }}
                  aria-label="Next week"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-7 overflow-hidden rounded-2xl border border-gray-100">
            {meetingCalendar.weekDays.map((day) => {
              const isSelected = day.fullDate.toDateString() === meetingSelectedDate.toDateString();
              const baseClasses = isSelected
                ? "bg-[color:var(--theme-primary)] text-white"
                : day.isWeekend
                  ? "bg-red-50 text-red-600"
                  : "bg-white";
              return (
                <button
                  type="button"
                  key={day.label + day.date}
                  onClick={() => setMeetingSelectedDate(day.fullDate)}
                  className={`flex flex-col items-center border-r border-gray-100 px-3 py-3 text-sm transition hover:bg-gray-50 ${baseClasses}`}
                >
                  <div
                    className={`text-xs ${isSelected ? "text-white" : day.isWeekend ? "text-red-600" : "text-gray-600"
                      }`}
                  >
                    {day.label}
                  </div>
                  <div
                    className={`text-lg font-semibold ${isSelected ? "text-white" : day.isWeekend ? "text-red-700" : "text-[#1f1f2d]"
                      }`}
                  >
                    {day.date}
                  </div>
                  <div
                    className={`text-xs ${isSelected
                      ? "text-white/80"
                      : day.isWeekend
                        ? "text-red-500"
                        : "text-gray-500"
                      }`}
                  >
                    {day.month}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-4">
            {meetingCalendar.filteredMeetings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
                No meetings for this day.
              </div>
            ) : (
              meetingCalendar.filteredMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <img
                        src={meeting.avatar}
                        alt={meeting.host}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#1f1f2d]">{meeting.host}</p>
                        <p className="text-xs text-gray-500">Senior account executive, RHO</p>
                        <p className="mt-2 text-base font-semibold text-[#1f1f2d]">
                          {meeting.title}
                        </p>
                        <p className="text-sm text-gray-600">{meeting.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button type="button" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-[#1f1f2d] shadow-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm font-semibold text-[#1f1f2d]">{meeting.timeLabel}</div>
                    <div className="text-xs text-gray-500">{meeting.timeZoneLabel}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function AttendanceChart({
  trend,
}: {
  trend: { labels: string[]; present: number[]; absent: number[]; late: number[] };
}) {
  const width = 300;
  const height = 160;
  const padding = 20;
  const maxValue = 100;
  const xStep = (width - padding * 2) / (trend.labels.length - 1);

  const buildPath = (values: number[]) =>
    values
      .map((v, idx) => {
        const x = padding + idx * xStep;
        const y = height - padding - (v / maxValue) * (height - padding * 2);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <title>Attendance Chart</title>
      <path d={buildPath(trend.present)} stroke="#7c3aed" strokeWidth={3} fill="none" />
      <path d={buildPath(trend.absent)} stroke="#f97316" strokeWidth={3} fill="none" />
      <path d={buildPath(trend.late)} stroke="#facc15" strokeWidth={3} fill="none" />
      {trend.labels.map((label, idx) => {
        const x = padding + idx * xStep;
        return (
          <text key={label} x={x} y={height - 5} textAnchor="middle" className="text-[9px] fill-gray-500">
            {label}
          </text>
        );
      })}
    </svg>
  );
}
