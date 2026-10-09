import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileContent } from "@/components/profile-content";
import { getReadyAuth, isAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "তথ্য আপডেট" };

export default async function UpdateProfilePage() {
  if (!isAuthConfigured()) {
    redirect("/signin?protected=1&next=/profile/update");
  }
  const auth = await getReadyAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signin?protected=1&next=/profile/update");
  }
  return <ProfileContent editing initialName={session.user.name} />;
}
