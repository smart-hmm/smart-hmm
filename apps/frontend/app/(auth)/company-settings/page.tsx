"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

/* =======================
   TYPES
======================= */

interface CompanySettingsForm {
  company: {
    name: string;
    email: string;
    phone: string;
  };
  workingTime: {
    days: string[];
    startHour: string;
    endHour: string;
  };
}

/* =======================
   MOCK DATA
======================= */

const TABS = ["General", "Working Time", "Branches", "Meeting Rooms"] as const;

const workingDayValues = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const branches = [
  { id: "1", name: "Ho Chi Minh", address: "District 1" },
  { id: "2", name: "Ha Noi", address: "Cau Giay" },
];

const meetingRooms = [
  { id: "1", name: "Room 01", branchName: "Ho Chi Minh" },
  { id: "2", name: "Room 02", branchName: "Ha Noi" },
];

/* =======================
   MAIN PAGE
======================= */

export default function CompanySettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("General");

  const { register, watch, setValue, handleSubmit } =
    useForm<CompanySettingsForm>({
      defaultValues: {
        company: {
          name: "",
          email: "",
          phone: "",
        },
        workingTime: {
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          startHour: "08:30",
          endHour: "18:00",
        },
      },
    });

  const selectedDays = watch("workingTime.days");

  function toggleDay(day: string) {
    if (selectedDays.includes(day)) {
      setValue(
        "workingTime.days",
        selectedDays.filter((d) => d !== day)
      );
    } else {
      setValue("workingTime.days", [...selectedDays, day]);
    }
  }

  function onSubmit(values: CompanySettingsForm) {
    console.log("✅ SAVED SETTINGS:", values);
  }

  return (
    <div className="p-6 max-w-full mx-auto space-y-6">
      {/* ✅ PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Company Settings</h1>
        <p className="text-sm text-muted-foreground text-foreground/80 pt-2">
          Manage company configuration, working hours, branches and meeting
          rooms.
        </p>
      </div>

      {/* ✅ TABS */}
      <div className="flex gap-2 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-foreground/50 hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="pt-6">
        {/* ================= GENERAL TAB ================= */}
        {activeTab === "General" && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold">Company Information</h2>
              <p className="text-sm text-muted-foreground">
                Basic identity & contact information.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Company Name</label>
              <input
                {...register("company.name")}
                className="w-full border rounded-md px-3 py-2"
                placeholder="Smart HMM Co., Ltd"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">
                Company Contact Email
              </label>
              <input
                {...register("company.email")}
                className="w-full border rounded-md px-3 py-2"
                placeholder="contact@company.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold">Company Phone</label>
              <input
                {...register("company.phone")}
                className="w-full border rounded-md px-3 py-2"
                placeholder="+84 987 654 321"
              />
            </div>
          </div>
        )}

        {/* ================= WORKING TIME TAB ================= */}
        {activeTab === "Working Time" && (
          <div className="space-y-8 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold">Working Time Settings</h2>
              <p className="text-sm text-muted-foreground">
                Define official working days & office hours.
              </p>
            </div>

            {/* Working Days */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Working Days</label>
              <p className="text-xs text-muted-foreground">
                Select which days employees are expected to work.
              </p>

              <div className="grid grid-cols-4 gap-3">
                {workingDayValues.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`border rounded-md py-2 text-sm font-semibold ${
                      selectedDays.includes(day)
                        ? "bg-primary text-white"
                        : "bg-background"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold">Work Start Hour</label>
                <p className="text-xs text-muted-foreground">
                  Employees earliest check-in time.
                </p>
                <input
                  type="time"
                  {...register("workingTime.startHour")}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold">Work End Hour</label>
                <p className="text-xs text-muted-foreground">
                  Employees latest check-out time.
                </p>
                <input
                  type="time"
                  {...register("workingTime.endHour")}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= BRANCHES TAB ================= */}
        {activeTab === "Branches" && (
          <div className="space-y-8 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Company Branches</h2>
                <p className="text-sm text-muted-foreground">
                  All physical office locations.
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-md font-semibold"
              >
                + Add Branch
              </button>
            </div>

            <div className="border rounded-xl divide-y">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{branch.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {branch.address}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded-md text-sm">
                      Edit
                    </button>
                    <button className="px-3 py-1 border rounded-md text-sm text-destructive">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= MEETING ROOMS TAB ================= */}
        {activeTab === "Meeting Rooms" && (
          <div className="space-y-8 max-w-3xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Meeting Rooms</h2>
                <p className="text-sm text-muted-foreground">
                  Rooms used for the booking system.
                </p>
              </div>

              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-md font-semibold"
              >
                + Add Room
              </button>
            </div>

            <div className="border rounded-xl divide-y">
              {meetingRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{room.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Branch: {room.branchName}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded-md text-sm">
                      Edit
                    </button>
                    <button className="px-3 py-1 border rounded-md text-sm text-destructive">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ SAVE BUTTON */}
        <div className="pt-10 border-t mt-10 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-md font-bold"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
