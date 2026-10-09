import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileContent } from "@/components/profile-content";
import { getReadyAuth, isAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "আমার প্রোফাইল" };

export default async function ProfilePage() {
  if (!isAuthConfigured()) {
    redirect("/signin?protected=1&next=/profile");
  }
  const auth = await getReadyAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin?protected=1&next=/profile");
  }
  return <ProfileContent initialName={session.user.name} />;
}
