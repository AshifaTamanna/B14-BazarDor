"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUserRound, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function AccountActions() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <span className="auth-loading" aria-label="অ্যাকাউন্ট লোড হচ্ছে" />;
  }

  if (!session?.user) {
    return (
      <>
        <Link className="button button-quiet header-signin" href="/signin">
          সাইন ইন
        </Link>
        <Link className="button button-primary header-signup" href="/signup">
          সাইন আপ
        </Link>
      </>
    );
  }

  async function signOut() {
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message || "সাইন আউট করা যায়নি।");
        return;
      }
      toast.success("আপনি সাইন আউট করেছেন।");
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "সাইন আউট করা যায়নি।",
      );
    }
  }

  return (
    <>
      <Link className="profile-link" href="/profile">
        <CircleUserRound size={18} />
        <span>{session.user.name || "আমার প্রোফাইল"}</span>
      </Link>
      <button className="signout-button" onClick={signOut} type="button">
        <LogOut size={16} />
        <span>সাইন আউট</span>
      </button>
    </>
  );
}
