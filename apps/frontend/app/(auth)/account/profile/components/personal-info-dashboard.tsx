"use client";

import Card from "@/components/ui/card";
import InfoItem from "@/components/ui/info-item";
import { RootState } from "@/services/redux/store";
import { DateTime } from "luxon";
import Image from "next/image";
import { useSelector } from "react-redux";

export function PersonalInfoDashboard() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-background border border-muted rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src="/avatar.png"
              alt="avatar"
              width={56}
              height={56}
              className="rounded-full"
            />
            <span className="absolute -bottom-1 -right-1 bg-success text-white text-[10px] px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>

          <div>
            <p className="font-bold text-lg">
              {user.employeeInfo?.firstName} {user.employeeInfo?.lastName}
            </p>
            <p className="text-sm text-foreground/60">
              {user.employeeInfo?.position} · Product
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Personal Details" editable>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              label="Full Name"
              value={`${user.employeeInfo?.firstName} ${user.employeeInfo?.lastName}`}
            />
            <InfoItem label="Email" value={user.employeeInfo?.email ?? ""} />
            <InfoItem
              label="Phone Number"
              value={user.employeeInfo?.phone ?? ""}
            />
            <InfoItem
              label="Date of Birth"
              value={
                user.employeeInfo?.dateOfBirth
                  ? DateTime.fromISO(user.employeeInfo.dateOfBirth).toFormat(
                      "dd/MM/yyyy"
                    )
                  : ""
              }
            />
          </div>
        </Card>

        <Card title="Employment Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Role" value={user.userInfo?.role ?? ""} />
            <InfoItem
              label="Position"
              value={user.employeeInfo?.position ?? ""}
            />
            <InfoItem
              label="Department"
              value={user.employeeInfo?.departmentID ?? "-"}
            />
            <InfoItem
              label="Supervisor"
              value={user.employeeInfo?.managerID ?? "-"}
            />
            <InfoItem
              label="Employment Status"
              value={
                user.employeeInfo?.employmentType
                  ? user.employeeInfo.employmentType
                      .toUpperCase()
                      .replaceAll("_", " ")
                  : ""
              }
            />
            <InfoItem
              label="Join Date"
              value={
                user.employeeInfo?.joinDate
                  ? new Date(user.employeeInfo.joinDate).toLocaleDateString()
                  : "-"
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
