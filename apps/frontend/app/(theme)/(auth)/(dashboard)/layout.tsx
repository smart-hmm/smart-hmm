import AuthLayout from "@/components/layout/auth-layout/auth-layout";
import HRMChatbotModal from "@/components/ui/chat-modal";
import WorkspaceTour from "@/components/ui/workspace-tour";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <HRMChatbotModal />
      {children}
      <WorkspaceTour />
    </AuthLayout>
  );
}
