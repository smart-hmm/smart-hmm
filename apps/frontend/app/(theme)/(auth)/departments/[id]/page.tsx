import { Metadata } from "next";
import DepartmentDetailsClient from "./client";
import { Department } from "@/types";
import api from "@/lib/http";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const sp = await searchParams;
  const resp = await api.get(`/departments/${id}`);
  const data = resp.data as Department;

  return {
    title: `${data.name} - ${sp.tab ?? "employees"}`,
    description: data.name,
  };
}

export default function DepartmentDetailsPage() {
  return <DepartmentDetailsClient />;
}
