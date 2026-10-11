import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";
import { isAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "সাইন ইন" };

type SignInProps = {
  searchParams: Promise<{
    next?: string;
    protected?: string;
    registered?: string;
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInProps) {
  const {
    next,
    protected: protectedRedirect,
    registered,
    error,
  } = await searchParams;
  const nextPath =
    next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  return (
    <AuthForm
      mode="signin"
      nextPath={nextPath}
      protectedRedirect={protectedRedirect === "1"}
      registered={registered === "1"}
      authError={error}
      authConfigured={isAuthConfigured()}
    />
  );
}
