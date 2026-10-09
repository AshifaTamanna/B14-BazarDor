import type { Metadata } from "next";
import HomePage from "@/app/page";

export const metadata: Metadata = { title: "ড্যাশবোর্ড" };
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <HomePage />;
}
