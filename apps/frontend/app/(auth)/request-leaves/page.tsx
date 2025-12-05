"use client";

import { useState } from "react";
import { Header } from "./components/header";
import { TabKey, Tabs } from "./components/tabs";
import { RequestLeaveDashboard } from "./components/request-leave-dashboard";
import { RequestLeaveHistoryDashboard } from "./components/leave-history-dashboard";

export default function ProfilePage() {
  const [tab, setTab] = useState<TabKey>("leave");

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <Tabs value={tab} onChange={setTab} />

      <div className="flex-1 px-6 py-10">
        {tab === "leave" && <RequestLeaveDashboard />}
        {tab === "leave-history" && <RequestLeaveHistoryDashboard />}
      </div>
    </div>
  );
}
