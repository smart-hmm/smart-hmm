"use client";

import Card from "@/components/ui/card";
import InfoItem from "@/components/ui/info-item";
import PrimaryButton from "@/components/ui/primary-button";
import SecondaryButton from "@/components/ui/secondary-button";

export function ContractDashboard() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] p-6 space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card title="Contract Duration">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <InfoItem label="Contract Start" value="17 September 2023" />
              <InfoItem label="Contract End" value="17 September 2024" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="h-2 w-full bg-[var(--color-muted)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-success)]"
                  style={{ width: "70%" }}
                />
              </div>
              <span className="ml-4 text-xs text-[var(--color-foreground)]/60">
                72 Days until expired
              </span>
            </div>
          </Card>

          <Card title="Contract Position Details">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <InfoItem label="Job Role" value="Project Manager" />
              <InfoItem label="Job Level" value="Manager Level" />
              <InfoItem label="Work Hours / Week" value="30 Hours" />
              <InfoItem label="Supervisor" value="Bagus Fikri" />
              <InfoItem label="Employment Status" value="Fulltime" />
              <InfoItem label="Department" value="Project Manager" />
            </div>
          </Card>

          <Card title="Compensation & Benefit">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <InfoItem label="Payment Type" value="Monthly Salary" />
              <InfoItem label="Basic Salary" value="$8,000 / month" />
              <InfoItem label="First Payment Amount" value="-" />
              <InfoItem label="Allowed to Submit Expenses" value="Yes" />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Working Scope">
            <ul className="space-y-3 text-sm list-disc pl-4">
              <li>Develop and test new IT solutions.</li>
              <li>Work with cross-functional teams.</li>
              <li>Research emerging technologies.</li>
              <li>Analyze data for business decisions.</li>
              <li>Manage R&D projects within budget.</li>
            </ul>
          </Card>

          <Card title="Contract Details">
            <div className="space-y-4 text-sm">
              <InfoItem label="Contract ID" value="#C79291020" />
              <InfoItem label="Country Tax Residence" value="Indonesia" />
              <InfoItem label="Effective Tax Date" value="11 December 2023" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
