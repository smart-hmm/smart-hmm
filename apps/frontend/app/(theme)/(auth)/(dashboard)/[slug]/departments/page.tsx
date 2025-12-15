import type { Metadata } from "next";
import DepartmentsClient from "./client";

export function generateMetadata(): Metadata {
  return {
    title: "Deparments",
  };
}

export default function DeparmentsPage() {
  return <DepartmentsClient />;
}
