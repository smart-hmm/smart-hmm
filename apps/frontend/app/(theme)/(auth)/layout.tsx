import AuthLayout from "@/components/layout/auth-layout/auth-layout";
import HRMChatbotModal from "@/components/ui/chat-modal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>
    <HRMChatbotModal />
    {children}
  </AuthLayout>;
}
