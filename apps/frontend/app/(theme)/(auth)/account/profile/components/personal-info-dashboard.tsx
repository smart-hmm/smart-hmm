"use client";

import Loading from "@/app/loading";
import Card from "@/components/ui/card";
import InfoItem from "@/components/ui/info-item";
import { useMe } from "@/services/react-query/queries/use-me";
import { User } from "lucide-react";
import { DateTime } from "luxon";

export function PersonalInfoDashboard() {
  const { data: user, isLoading, error } = useMe();

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-background border border-muted rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* <Image
              src="/avatar.png"
              alt="avatar"
              width={56}
              height={56}
              className="rounded-full"
            /> */}
            <div className="w-14 aspect-square rounded-full bg-muted flex items-center justify-center">
              <User size={35} />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-success text-white text-[10px] px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>

          <div>
            <p className="font-bold text-lg">
              {user?.employee?.firstName} {user?.employee?.lastName}
            </p>
            <p className="text-sm text-foreground/60">
              {user?.employee?.position} · Product
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Personal Details" editable>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              label="Full Name"
              value={`${user?.employee?.firstName} ${user?.employee?.lastName}`}
            />
            <InfoItem label="Email" value={user?.employee?.email ?? ""} />
            <InfoItem
              label="Phone Number"
              value={user?.employee?.phone ?? ""}
            />
            <InfoItem
              label="Date of Birth"
              value={
                user?.employee?.dateOfBirth
                  ? DateTime.fromISO(user?.employee.dateOfBirth).toFormat(
                      "dd/MM/yyyy"
                    )
                  : ""
              }
            />
          </div>
        </Card>

        <Card title="Employment Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Role" value={user?.user.role ?? ""} />
            <InfoItem label="Position" value={user?.employee?.position ?? ""} />
            <InfoItem
              label="Department"
              value={user?.employee?.departmentID ?? "-"}
            />
            <InfoItem
              label="Supervisor"
              value={user?.employee?.managerID ?? "-"}
            />
            <InfoItem
              label="Employment Status"
              value={
                user?.employee?.employmentType
                  ? user?.employee.employmentType
                      .toUpperCase()
                      .replaceAll("_", " ")
                  : ""
              }
            />
            <InfoItem
              label="Join Date"
              value={
                user?.employee?.joinDate
                  ? new Date(user?.employee.joinDate).toLocaleDateString()
                  : "-"
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
