import api from "@/lib/http";
import { notFound } from "next/navigation";

export default async function DashboardHomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resp = await api.get(`/tenants/${slug}`).catch(() => null)
  if (!resp) notFound();
  return <h1>Home</h1>;
}

