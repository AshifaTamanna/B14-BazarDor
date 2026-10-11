import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { isAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "সাইন আপ" };
export const dynamic = "force-dynamic";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const nextPath =
    next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  return (
    <AuthForm
      mode="signup"
      nextPath={nextPath}
      authError={error}
      authConfigured={isAuthConfigured()}
    />
  );
}
