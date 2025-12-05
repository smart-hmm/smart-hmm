"use client";

import { useState } from "react";
import { ProfileTabs, TabKey } from "./components/profile-tabs";
import { PersonalInfoDashboard } from "./components/personal-info-dashboard";
import { PayrollsDashboard } from "./components/payrolls-dashboard";
import { AttendanceDashboard } from "./components/attendances-dashboard";
import { ProfileHeader } from "./components/profile-header";
import { ContractDashboard } from "./components/contract-dashboard";
import { TimeManagementDashboard } from "./components/time-management-dashboard";
import { AssetsDashboard } from "./components/assets-dashboard";
import { DocumentsDashboard } from "./components/documents-dashboard";

export default function ProfilePage() {
  const [tab, setTab] = useState<TabKey>("personal");

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col">
      <ProfileHeader />

      <ProfileTabs value={tab} onChange={setTab} />

      <div className="flex-1 px-6 py-10">
        {tab === "personal" && <PersonalInfoDashboard />}
        {tab === "contract" && <ContractDashboard />}
        {tab === "payrolls" && <PayrollsDashboard />}
        {tab === "attendances" && <AttendanceDashboard />}
        {tab === "time" && <TimeManagementDashboard />}
        {tab === "assets" && <AssetsDashboard />}
        {tab === "documents" && <DocumentsDashboard />}
      </div>
    </div>
  );
}
