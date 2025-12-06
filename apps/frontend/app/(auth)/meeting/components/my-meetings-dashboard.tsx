"use client";

import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

/* =======================
   TYPES
======================= */

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

/* =======================
   MOCK DATA
======================= */

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
    method: "remote",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "3",
    name: "You",
    title: "1:1 with Manager",
    date: "2025-12-01",
    startTime: "10:00",
    endTime: "10:30",
    invites: "manager@company.com",
    method: "office",
    room: "Room 03",
    branch: "Ha Noi",
  },
];

/* =======================
   HELPERS
======================= */

function bookingStartToDate(b: Booking): Date {
  return new Date(`${b.date}T${b.startTime}:00`);
}

function sortByStartAsc(a: Booking, b: Booking) {
  return bookingStartToDate(a).getTime() - bookingStartToDate(b).getTime();
}

function sortByStartDesc(a: Booking, b: Booking) {
  return bookingStartToDate(b).getTime() - bookingStartToDate(a).getTime();
}

/* =======================
   PAGE
======================= */

export default function MyMeetingsDashboard() {
  const router = useRouter();
  const now = useMemo(() => new Date(), []);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { upcoming, past } = useMemo(() => {
    const upcoming: Booking[] = [];
    const past: Booking[] = [];

    for (const b of INITIAL_BOOKINGS) {
      const start = bookingStartToDate(b);
      if (start.getTime() >= now.getTime()) {
        upcoming.push(b);
      } else {
        past.push(b);
      }
    }

    return {
      upcoming: upcoming.sort(sortByStartAsc),
      past: past.sort(sortByStartDesc),
    };
  }, [now]);

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          Upcoming Meetings
        </h2>

        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have no upcoming meetings.
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((m) => (
              <MeetingCard
                key={m.id}
                booking={m}
                onView={() => setSelectedBooking(m)}
              />
            ))}
          </div>
        )}
      </section>

      {/* PAST */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Past Meetings</h2>

        {past.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have no past meetings yet.
          </p>
        ) : (
          <div className="space-y-2">
            {past.map((m) => (
              <MeetingCard
                key={m.id}
                booking={m}
                onView={() => setSelectedBooking(m)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ✅ DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md bg-background rounded-xl border border-muted p-5 shadow-xl text-foreground">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Meeting Details</h3>

              <button
                onClick={() => setSelectedBooking(null)}
                className="text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">Title</p>
                <p>{selectedBooking.title}</p>
              </div>

              <div>
                <p className="font-semibold">Organizer</p>
                <p>{selectedBooking.name}</p>
              </div>

              <div>
                <p className="font-semibold">Date</p>
                <p>{selectedBooking.date}</p>
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
                  {selectedBooking.meetLink ? (
                    <a
                      href={selectedBooking.meetLink}
                      target="_blank"
                      className="text-blue-600 underline break-all"
                    >
                      {selectedBooking.meetLink}
                    </a>
                  ) : (
                    <p>No link</p>
                  )}
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
                onClick={() => setSelectedBooking(null)}
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

/* =======================
   CARD COMPONENT
======================= */

function MeetingCard({
  booking,
  onView,
}: {
  booking: Booking;
  onView: () => void;
}) {
  const start = bookingStartToDate(booking);
  const dateLabel = start.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-muted bg-[var(--color-surface)] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-foreground">
      <div className="space-y-1">
        <p className="text-sm font-semibold">{booking.title}</p>

        <p className="text-xs text-muted-foreground">
          {dateLabel} · {booking.startTime} – {booking.endTime}
        </p>

        <p className="text-xs text-muted-foreground">
          Organizer: <span className="font-medium">{booking.name}</span>
        </p>

        {booking.method === "office" && (
          <p className="text-xs text-muted-foreground">
            Office · {booking.branch} · {booking.room}
          </p>
        )}

        {booking.method === "remote" && (
          <p className="text-xs text-muted-foreground">Remote</p>
        )}
      </div>

      <div className="flex items-center gap-2 self-start md:self-auto">
        {booking.method === "remote" && booking.meetLink && (
          <a
            href={booking.meetLink}
            target="_blank"
            className="px-3 py-1.5 rounded-md bg-[var(--color-primary)] text-xs text-white font-semibold"
          >
            Join
          </a>
        )}

        <button
          onClick={onView}
          className="px-3 py-1.5 rounded-md border text-xs font-semibold"
        >
          View details
        </button>
      </div>
    </div>
  );
}
