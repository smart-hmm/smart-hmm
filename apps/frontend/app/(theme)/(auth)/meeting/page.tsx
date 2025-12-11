import { Metadata } from "next";
import MeetingClient from "./client";

export function generateMetadata(): Metadata {
  return {
    title: "Meeting",
  };
}

export default function MeetingPage() {
  return <MeetingClient />;
}
