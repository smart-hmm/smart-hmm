"use client";

import AuthLayout from "@/components/layout/auth-layout/auth-layout";
import HRMChatbotModal from "@/components/ui/chat-modal";
import FirstRunGuideModal from "@/components/ui/first-run-guide-modal";
import WorkspaceTour from "@/components/ui/workspace-tour";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(
    !localStorage.getItem("workspace_tour_seen")
  );

  return (
    <AuthLayout>
      <HRMChatbotModal />
      {children}
      <FirstRunGuideModal
        open={isOpen}
        onClose={() => {
          setOpen(false);
        }}
      />
      {!isOpen && <WorkspaceTour />}
    </AuthLayout>
  );
}
