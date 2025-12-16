import { Metadata } from "next";
import CreateMeetingClient from "./client";

export const metadata: Metadata = {
  title: "Create Meeting",
};

export default function CreateMeetingPage() {
  return <CreateMeetingClient />;
}
