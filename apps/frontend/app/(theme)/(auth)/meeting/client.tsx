"use client";

import { useState } from "react";
import { Header } from "./components/header";
import { TabKey, Tabs } from "./components/tabs";
import BookingDashboard from "./components/booking-dashboard";
import MyMeetingsDashboard from "./components/my-meetings-dashboard";

export default function MeetingClient() {
  const [tab, setTab] = useState<TabKey>("booking");

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <Tabs value={tab} onChange={setTab} />

      <div className="flex-1 px-6 py-10">
        {tab === "booking" && <BookingDashboard />}
        {tab === "my-meetings" && <MyMeetingsDashboard />}
      </div>
    </div>
  );
}
