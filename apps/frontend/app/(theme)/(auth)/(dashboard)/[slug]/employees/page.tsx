import type { Metadata } from "next";
import EmployeesClient from "./client";

export function generateMetadata(): Metadata {
  return {
    title: "Employees",
  };
}

export default function EmployeesPage() {
  return <EmployeesClient />;
}
