import api from "@/lib/http";
import { TenantInfo } from "@/types/tenant";

export default async function DashboardHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let tenantInfo: TenantInfo | null = null;

  try {
    const resp = await api.get(`/tenants/${slug}`);
    tenantInfo = resp.data;
  } catch {}

  if (!tenantInfo) return <h1>Asdad</h1>;

  return <h1>Home</h1>;
}
