"use client";

import {
  Bell,
  Calendar,
  Clock,
  Link2,
  MapPin,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function formatKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function CreateMeetingClient() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const meetingHref = params?.slug ? `/${params.slug}/meeting` : "/meeting";

  const [startDate, setStartDate] = useState(formatKey(new Date()));
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [description, setDescription] = useState(
    "We are introducing the new design tokens for the app. They are set so they can be added in light and dark mode, and can be switched with the new variables."
  );
  const [objective, setObjective] = useState(
    "Every design system member knows about the design tokens and how to apply them."
  );
  const [finishCriteria, setFinishCriteria] = useState(
    "When every team member understands the value of using tokens and how to apply them in the different products."
  );
  const [meetingCost, setMeetingCost] = useState("8h");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [tagsInput, setTagsInput] = useState("Product Designers, Design System");
  const [tagsList, setTagsList] = useState<string[]>([
    "Product Designers",
    "Design System",
  ]);
  const [inviteEmailInput, setInviteEmailInput] = useState("");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteEmailError, setInviteEmailError] = useState("");
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#8b5cf6");

  const mockUserEmails = useMemo(
    () => [
      "ada@gmail.com",
      "emma@example.com",
      "liam@example.com",
      "ava@example.com",
      "mia@example.com",
    ],
    []
  );

  const filteredEmailSuggestions = useMemo(
    () =>
      mockUserEmails.filter(
        (email) =>
          !inviteEmails.includes(email) &&
          email.toLowerCase().includes(inviteEmailInput.toLowerCase().trim())
      ),
    [mockUserEmails, inviteEmails, inviteEmailInput]
  );

  const commitTags = () => {
    const entries = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (entries.length) {
      setTagsList((prev) => Array.from(new Set([...prev, ...entries])));
    }
  };

  const commitInviteEmail = (provided?: string) => {
    const email = (provided ?? inviteEmailInput).trim();
    if (!email) return;
    const isValid =
      /^[\w.!#$%&'*+/=?^`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/.test(email);
    if (!isValid) {
      setInviteEmailError("Enter a valid email");
      return;
    }
    if (!mockUserEmails.includes(email)) {
      setInviteEmailError("User not found in workspace");
      return;
    }
    setInviteEmails((prev) => (prev.includes(email) ? prev : [...prev, email]));
    setInviteEmailInput("");
    setInviteEmailError("");
    setShowEmailSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f7fb] text-[#1f1f2d]">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={meetingHref}
              className="text-sm font-semibold text-[color:var(--theme-primary)]"
            >
              ← Back to meetings
            </Link>
            <h1 className="text-2xl font-bold">Create Meeting</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
              onClick={() => router.push(meetingHref)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: selectedColor }}
            >
              Save
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <label className="w-full space-y-1">
              <span className="text-xs font-semibold text-gray-600">Title</span>
              <input
                defaultValue="Meet!"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold outline-none focus:border-[color:var(--theme-primary)]"
              />
            </label>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-3">
            <label className="flex flex-col gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Calendar className="h-4 w-4 text-gray-500" /> Date
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--theme-primary)]/30"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Clock className="h-4 w-4 text-gray-500" /> Start time
              </span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-lg bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--theme-primary)]/30"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Clock className="h-4 w-4 text-gray-500" /> End time
              </span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-lg bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--theme-primary)]/30"
              />
            </label>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Tags
            </label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onBlur={commitTags}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitTags();
                }
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[color:var(--theme-primary)]"
              placeholder="Comma separated"
            />
            <div className="flex flex-wrap gap-2">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setTagsList((prev) => prev.filter((t) => t !== tag))
                    }
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {tagsList.length === 0 && (
                <span className="text-xs text-gray-500">
                  No tags yet. Add with Enter or comma.
                </span>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-2">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-gray-600">
              <UserPlus className="h-4 w-4 text-gray-500" />
              Invite by email
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  value={inviteEmailInput}
                  onFocus={() => setShowEmailSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 100)}
                  onChange={(e) => {
                    setInviteEmailInput(e.target.value);
                    if (inviteEmailError) setInviteEmailError("");
                    setShowEmailSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitInviteEmail();
                    }
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                    inviteEmailError
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-[color:var(--theme-primary)]"
                  }`}
                  placeholder="name@example.com"
                />
                {showEmailSuggestions &&
                  inviteEmailInput.trim().length > 0 &&
                  filteredEmailSuggestions.length > 0 && (
                    <div className="dropdown-animate absolute left-0 right-0 top-full z-20 mt-1 max-h-44 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                      {filteredEmailSuggestions.map((email) => (
                        <button
                          key={email}
                          type="button"
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            commitInviteEmail(email);
                          }}
                        >
                          <span>{email}</span>
                          <span className="text-[10px] uppercase text-gray-400">
                            Invite
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
              <button
                type="button"
                className="rounded-lg bg-[color:var(--theme-primary)] px-3 py-2 text-xs font-semibold text-white shadow-sm"
                onClick={() => commitInviteEmail()}
              >
                Add
              </button>
            </div>
            {inviteEmailError && (
              <p className="text-xs text-red-500">{inviteEmailError}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {inviteEmails.map((email) => (
                <span
                  key={email}
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                >
                  {email}
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setInviteEmails((prev) =>
                        prev.filter((item) => item !== email)
                      )
                    }
                    aria-label={`Remove ${email}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {inviteEmails.length === 0 && (
                <span className="text-xs text-gray-500">
                  No invites yet. Add emails above.
                </span>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="space-y-3 rounded-2xl bg-gray-50 p-3">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1 block">
                Description
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[color:var(--theme-primary)]"
                rows={3}
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1 block">
                Objective
              </div>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[color:var(--theme-primary)]"
                rows={2}
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1 block">
                Finish Criteria
              </div>
              <textarea
                value={finishCriteria}
                onChange={(e) => setFinishCriteria(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[color:var(--theme-primary)]"
                rows={2}
              />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="rounded-xl border border-gray-200 p-3">
              <span className="text-xs font-semibold text-gray-600 block mb-1">
                Meeting Cost
              </span>
              <input
                value={meetingCost}
                onChange={(e) => setMeetingCost(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[color:var(--theme-primary)]"
              />
            </label>
            <label className="rounded-xl border border-gray-200 p-3">
              <span className="text-xs font-semibold text-gray-600 block mb-1">
                Priority
              </span>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "Low" | "Medium" | "High")
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[color:var(--theme-primary)]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>

          <div className="h-px bg-gray-100" />

          <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
            <Link2 className="h-4 w-4 text-gray-500" />
            <div className="w-full space-y-1">
              <span className="text-xs font-semibold text-gray-600">
                Meeting link
              </span>
              <input
                defaultValue="https://meet.google.com/zp-srsk-kxf"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[color:var(--theme-primary)]"
              />
            </div>
          </label>

          <div className="h-px bg-gray-100" />

          <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div className="w-full space-y-1">
              <span className="text-xs font-semibold text-gray-600">
                Location
              </span>
              <input
                defaultValue="Jakarta, Indonesia"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[color:var(--theme-primary)]"
              />
            </div>
          </label>

          <div className="h-px bg-gray-100" />

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
              <button className="text-xs font-semibold text-[color:var(--theme-primary)]">
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
                  type="button"
                  className="h-7 w-7 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Reminder color ${color}`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600"
          >
            <Bell className="h-4 w-4" />
            Reminder at 3 PM
          </button>
        </div>
      </div>

      <style jsx global>{`
        .dropdown-animate {
          animation: dropdownIn 140ms ease-out;
          transform-origin: top center;
        }

        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
