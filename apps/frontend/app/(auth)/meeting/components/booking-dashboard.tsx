"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  name: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  invites: string;

  method: "office" | "remote";

  meetLink?: string;

  room?: string;
  branch?: string;
}

interface CalendarDay {
  date: Date;
  label: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

const bookingSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    title: z.string().min(2, "Meeting title is required"),
    invites: z.string().optional(),

    method: z.enum(["office", "remote"]),

    meetLink: z.string().optional(),
    room: z.string().optional(),
    branch: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === "remote" && !data.meetLink) {
      ctx.addIssue({
        path: ["meetLink"],
        message: "Meeting link is required for remote meetings",
        code: "custom",
      });
    }

    if (data.method === "office") {
      if (!data.room) {
        ctx.addIssue({
          path: ["room"],
          message: "Meeting room is required",
          code: "custom",
        });
      }

      if (!data.branch) {
        ctx.addIssue({
          path: ["branch"],
          message: "Branch location is required",
          code: "custom",
        });
      }
    }
  });

type BookingFormValues = z.infer<typeof bookingSchema>;

const AVAILABLE_PEOPLE = [
  { name: "Nguyen Van A", email: "a.nguyen@company.com" },
  { name: "Tran Thi B", email: "b.tran@company.com" },
  { name: "Le Van C", email: "c.le@company.com" },
  { name: "Pham Thi D", email: "d.pham@company.com" },
  { name: "Hoang Minh E", email: "e.hoang@company.com" },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "1",
    name: "Nguyen Van A",
    title: "HR Interview",
    date: "2025-12-05",
    startTime: "09:00",
    endTime: "10:30",
    invites: "hr@company.com",

    method: "office",
    room: "Room 01",
    branch: "Ho Chi Minh",
  },
  {
    id: "2",
    name: "Tran Thi B",
    title: "Sprint Planning",
    date: "2025-12-05",
    startTime: "14:00",
    endTime: "15:00",
    invites: "team@company.com",

    method: "office",
    room: "Room 02",
    branch: "Ha Noi",
  },
];

const WORK_TIME_CONFIG = {
  start: "08:30",
  end: "18:00",
};

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  const hh = String(Math.floor(m / 60)).padStart(2, "0");
  const mm = String(m % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function generateTimeSlotsWithinWorkTime(start: string, end: string): string[] {
  const slots: string[] = [];

  let current = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);

  while (current < endMinutes) {
    slots.push(minutesToTime(current));
    current += 15;
  }

  return slots;
}

function getNextSlot(slot: string, slots: string[]): string | null {
  const idx = slots.indexOf(slot);
  if (idx === -1 || idx === slots.length - 1) return null;
  return slots[idx + 1];
}

function isSlotBooked(
  date: Date,
  slot: string,
  bookings: Booking[],
  selectedRoom?: string,
  selectedBranch?: string
): Booking | null {
  const key = date.toISOString().slice(0, 10);

  return (
    bookings.find((b) => {
      if (b.date !== key) return false;

      if (
        b.method === "office" &&
        selectedRoom &&
        selectedBranch &&
        b.room === selectedRoom &&
        b.branch === selectedBranch
      ) {
        return slot >= b.startTime && slot < b.endTime;
      }

      return false;
    }) || null
  );
}

export default function BookingDashboard() {
  const router = useRouter();
  const [inviteQuery, setInviteQuery] = useState("");
  const [showInviteDropdown, setShowInviteDropdown] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchValue = getLastInviteSegment(inviteQuery);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);

  const timeSlots = useMemo(
    () =>
      generateTimeSlotsWithinWorkTime(
        WORK_TIME_CONFIG.start,
        WORK_TIME_CONFIG.end
      ),
    []
  );

  const days = useMemo<CalendarDay[]>(() => {
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const startWeekday = first.getDay();
    const totalDays = last.getDate();

    const result: CalendarDay[] = [];

    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      result.push({
        date: d,
        label: d.getDate(),
        isCurrentMonth: false,
        isToday: false,
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      result.push({
        date: d,
        label: i,
        isCurrentMonth: true,
        isToday: d.toDateString() === today.toDateString(),
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
      });
    }

    return result;
  }, [currentMonth]);

  function getBookingsForDay(date: Date) {
    const key = date.toISOString().slice(0, 10);
    return bookings.filter((b) => b.date === key);
  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      method: "office",
    },
  });

  const handleCreateBooking = (values: BookingFormValues) => {
    if (!selectedDate || !rangeStart || !rangeEnd) return;

    const start = rangeStart < rangeEnd ? rangeStart : rangeEnd;
    const endInclusive = rangeStart < rangeEnd ? rangeEnd : rangeStart;
    const endExclusive = getNextSlot(endInclusive, timeSlots) ?? endInclusive;

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      name: values.name,
      title: values.title,
      startTime: start,
      endTime: endExclusive,
      invites: inviteQuery,
      date: selectedDate.toISOString().slice(0, 10),

      method: values.method,

      meetLink: values.method === "remote" ? values.meetLink : undefined,
      room: values.method === "office" ? values.room : undefined,
      branch: values.method === "office" ? values.branch : undefined,
    };

    setBookings((prev) => [...prev, newBooking]);

    reset({ method: "office" });
    setRangeStart(null);
    setRangeEnd(null);
    setIsModalOpen(false);

    setInviteQuery("");
    setShowInviteDropdown(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setRangeStart(null);
    setRangeEnd(null);
    setInviteQuery("");
    setShowInviteDropdown(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
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
          className="px-4 py-2 rounded-md bg-primary text-white"
        >
          ←
        </button>

        <p className="text-lg font-bold">
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
          className="px-4 py-2 rounded-md bg-primary text-white"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-bold text-primary">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3">
        {days.map((day) => {
          const dailyBookings = getBookingsForDay(day.date);

          return (
            <div
              key={day.date.toISOString()}
              onClick={() => {
                if (day.isCurrentMonth) {
                  setSelectedDate(day.date);
                  setIsModalOpen(true);
                  setRangeStart(null);
                  setRangeEnd(null);
                }
              }}
              className={`
                min-h-[120px] rounded-xl border border-muted p-2 text-sm cursor-pointer flex flex-col
                ${
                  day.isWeekend
                    ? "bg-accent/20 border-accent"
                    : day.isCurrentMonth
                    ? "bg-background hover:bg-surface"
                    : "bg-muted/40 opacity-50"
                }
                ${day.isToday ? "ring-2 ring-info" : ""}
              `}
            >
              <div className="flex justify-between mb-1 text-md text-primary font-semibold">
                <span>{day.label}</span>
                {dailyBookings.length > 0 && (
                  <span className="text-primary font-bold">
                    {dailyBookings.length}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto">
                {dailyBookings.map((b) => (
                  <div
                    key={b.id}
                    className="text-[10px] text-foreground rounded-md px-2 py-1 bg-surface border border-muted/20"
                  >
                    <p className="font-semibold truncate">
                      {b.startTime}–{b.endTime} {b.title}
                    </p>
                    <p className="truncate">{b.name}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-5xl bg-background rounded-xl border border-muted p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">
                Book Meeting — {selectedDate.toDateString()}
              </h2>
              <button onClick={closeModal}>✕</button>
            </div>

            <div className="grid grid-cols-8 gap-2 mb-6">
              {timeSlots.map((slot) => {
                const booked = isSlotBooked(
                  selectedDate,
                  slot,
                  bookings,
                  watch("room"),
                  watch("branch")
                );

                const selected =
                  rangeStart &&
                  (slot === rangeStart ||
                    (rangeEnd &&
                      slot >= (rangeStart < rangeEnd ? rangeStart : rangeEnd) &&
                      slot <= (rangeStart < rangeEnd ? rangeEnd : rangeStart)));

                return (
                  <div
                    key={slot}
                    onClick={() => {
                      if (booked) {
                        setSelectedBooking(booked);
                        setIsViewModalOpen(true);
                        return;
                      }

                      const isSelected =
                        rangeStart &&
                        (slot === rangeStart ||
                          (rangeEnd &&
                            slot >=
                              (rangeStart < rangeEnd ? rangeStart : rangeEnd) &&
                            slot <=
                              (rangeStart < rangeEnd ? rangeEnd : rangeStart)));

                      if (isSelected) {
                        setRangeStart(null);
                        setRangeEnd(null);
                        return;
                      }

                      if (!rangeStart) {
                        setRangeStart(slot);
                        setRangeEnd(null);
                        return;
                      }

                      if (!rangeEnd) {
                        if (slot === rangeStart) return;

                        const start = slot > rangeStart ? rangeStart : slot;
                        const end = slot > rangeStart ? slot : rangeStart;

                        const conflict = hasConflictInRange(
                          selectedDate,
                          start,
                          end,
                          timeSlots,
                          bookings,
                          watch("room"),
                          watch("branch")
                        );

                        if (conflict) {
                          alert(
                            "This time range contains an existing booking."
                          );
                          return;
                        }

                        setRangeStart(start);
                        setRangeEnd(end);
                        return;
                      }

                      setRangeStart(slot);
                      setRangeEnd(null);
                    }}
                    className={`
                      h-16 rounded-lg border border-muted shadow-md flex flex-col text-foreground items-center justify-center text-[11px] font-semibold cursor-pointer transition
                      ${
                        booked
                          ? "bg-[var(--color-danger)]/20 border-[var(--color-danger)] text-[var(--color-danger)] cursor-not-allowed"
                          : selected
                          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                          : "bg-background hover:bg-[var(--color-surface)]"
                      }
                    `}
                  >
                    <span>{slot}</span>

                    {booked && (
                      <>
                        <span className="text-[10px] truncate">
                          {booked.title}
                        </span>
                        <span className="text-[10px] truncate">
                          {booked.name}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleSubmit(handleCreateBooking)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
            >
              {/* Name */}
              <div>
                <label className="block mb-1 font-semibold text-foreground">
                  Your Name
                </label>
                <input
                  {...register("name")}
                  className="w-full rounded-md border px-3 py-2 text-foreground"
                />
                {errors.name && (
                  <p className="text-xs text-danger">{errors.name.message}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block mb-1 font-semibold text-foreground">
                  Meeting Title
                </label>
                <input
                  {...register("title")}
                  className="w-full rounded-md border px-3 py-2 text-foreground"
                />
                {errors.title && (
                  <p className="text-xs text-danger">{errors.title.message}</p>
                )}
              </div>

              {/* Invites */}
              <div className="md:col-span-2 relative">
                <label className="block mb-1 font-semibold text-foreground">
                  Invite People
                </label>

                <input
                  value={inviteQuery}
                  onChange={(e) => {
                    setInviteQuery(e.target.value);
                    setShowInviteDropdown(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowInviteDropdown(false), 150)
                  }
                  className="w-full rounded-md border px-3 py-2 text-foreground"
                  placeholder="Type name or email..."
                />

                {showInviteDropdown && inviteQuery && (
                  <div className="absolute z-50 mt-1 w-full bg-background border border-muted rounded-md shadow-lg max-h-48 overflow-y-auto text-foreground">
                    {AVAILABLE_PEOPLE.filter(
                      (p) =>
                        p.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                        p.email
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                    ).map((person) => (
                      <button
                        key={person.email}
                        type="button"
                        onClick={() => {
                          setInviteQuery((prev) => {
                            const parts = prev.split(",");

                            // ✅ Replace ONLY the last typed segment
                            parts[parts.length - 1] = ` ${person.email}`;

                            return parts
                              .map((p) => p.trim())
                              .filter(Boolean)
                              .join(", ");
                          });

                          setShowInviteDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-[var(--color-surface)] text-sm"
                      >
                        <p className="font-semibold">{person.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {person.email}
                        </p>
                      </button>
                    ))}

                    {AVAILABLE_PEOPLE.filter(
                      (p) =>
                        p.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                        p.email
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                    ).length === 0 && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        No matching users
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-semibold text-foreground">
                  Meeting Method
                </label>
                <select
                  {...register("method")}
                  className="w-full rounded-md border px-3 py-2 bg-background text-foreground"
                >
                  <option value="office">Office</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              {watch("method") === "remote" && (
                <div className="md:col-span-2 text-foreground">
                  <label className="block mb-1 font-semibold">
                    Meeting Link
                  </label>
                  <input
                    {...register("meetLink")}
                    placeholder="https://zoom.us/..."
                    className="w-full rounded-md border px-3 py-2 text-foreground"
                  />
                  {errors.meetLink && (
                    <p className="text-xs text-danger">
                      {errors.meetLink.message}
                    </p>
                  )}
                </div>
              )}

              {watch("method") === "office" && (
                <>
                  <div>
                    <label className="block mb-1 font-semibold text-foreground">
                      Branch Location
                    </label>
                    <select
                      {...register("branch")}
                      className="w-full rounded-md border px-3 py-2 bg-background text-foreground"
                    >
                      <option value="">Select branch</option>
                      <option value="Ho Chi Minh">Ho Chi Minh</option>
                      <option value="Ha Noi">Ha Noi</option>
                    </select>
                    {errors.branch && (
                      <p className="text-xs text-danger">
                        {errors.branch.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-foreground">
                      Meeting Room
                    </label>
                    <select
                      {...register("room")}
                      className="w-full rounded-md border px-3 py-2 bg-background text-foreground"
                    >
                      <option value="">Select room</option>
                      <option value="Room 01">Room 01</option>
                      <option value="Room 02">Room 02</option>
                      <option value="Room 03">Room 03</option>
                    </select>
                    {errors.room && (
                      <p className="text-xs text-danger">
                        {errors.room.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="md:col-span-2 text-xs font-semibold text-foreground">
                Selected Time:{" "}
                {rangeStart && rangeEnd
                  ? `${rangeStart} → ${rangeEnd}`
                  : "None"}
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-4 text-foreground">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!rangeStart || !rangeEnd}
                  className="px-5 py-2 rounded-md bg-primary text-white font-semibold disabled:opacity-40"
                >
                  Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-background rounded-xl border border-muted p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 text-foreground">
              <h3 className="font-bold text-lg">Meeting Details</h3>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-foreground">
              <div>
                <p className="font-semibold">Title</p>
                <p>{selectedBooking.title}</p>
              </div>

              <div>
                <p className="font-semibold">Organizer</p>
                <p>{selectedBooking.name}</p>
              </div>

              <div>
                <p className="font-semibold">Time</p>
                <p>
                  {selectedBooking.startTime} → {selectedBooking.endTime}
                </p>
              </div>

              <div>
                <p className="font-semibold">Invites</p>
                <p className="break-all">
                  {selectedBooking.invites || "No invites"}
                </p>
              </div>

              <div>
                <p className="font-semibold">Method</p>
                <p className="capitalize">{selectedBooking.method}</p>
              </div>

              {selectedBooking.method === "remote" && (
                <div>
                  <p className="font-semibold">Meeting Link</p>
                  <a
                    href={selectedBooking.meetLink}
                    target="_blank"
                    className="text-blue-600 underline break-all"
                  >
                    {selectedBooking.meetLink}
                  </a>
                </div>
              )}

              {selectedBooking.method === "office" && (
                <>
                  <div>
                    <p className="font-semibold">Branch</p>
                    <p>{selectedBooking.branch}</p>
                  </div>

                  <div>
                    <p className="font-semibold">Room</p>
                    <p>{selectedBooking.room}</p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-5 flex justify-end">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 rounded-md border font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function hasConflictInRange(
  date: Date,
  start: string,
  end: string,
  slots: string[],
  bookings: Booking[],
  selectedRoom?: string,
  selectedBranch?: string
): boolean {
  const startIdx = slots.indexOf(start);
  const endIdx = slots.indexOf(end);

  const from = Math.min(startIdx, endIdx);
  const to = Math.max(startIdx, endIdx);

  for (let i = from; i <= to; i++) {
    const slot = slots[i];

    const booked = isSlotBooked(
      date,
      slot,
      bookings,
      selectedRoom,
      selectedBranch
    );

    if (booked) return true;
  }

  return false;
}

function getLastInviteSegment(value: string): string {
  const parts = value.split(",");
  return parts[parts.length - 1].trim();
}
