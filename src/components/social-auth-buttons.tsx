"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function SocialAuthButtons({
  callbackURL = "/dashboard",
}: {
  callbackURL?: string;
}) {
  const [provider, setProvider] = useState<"google" | "github" | null>(null);

  async function signInWithSocial(selectedProvider: "google" | "github") {
    setProvider(selectedProvider);
    try {
      const result = await authClient.signIn.social({
        provider: selectedProvider,
        callbackURL,
      });
      if (result.error) {
        toast.error(
          result.error.message ||
            `${selectedProvider === "google" ? "Google" : "GitHub"} সাইন ইন চালু নেই।`,
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "সামাজিক মাধ্যমে সাইন ইন করা যায়নি।",
      );
    } finally {
      setProvider(null);
    }
  }

  return (
    <div className="social-auth">
      <button
        className="social-button"
        disabled={provider !== null}
        onClick={() => signInWithSocial("google")}
        type="button"
      >
        <span className="google-mark" aria-hidden="true">G</span>
        {provider === "google" ? "সংযোগ হচ্ছে..." : "Google দিয়ে চালিয়ে যান"}
      </button>
      <button
        className="social-button"
        disabled={provider !== null}
        onClick={() => signInWithSocial("github")}
        type="button"
      >
        <span className="github-mark" aria-hidden="true">●</span>
        {provider === "github" ? "সংযোগ হচ্ছে..." : "GitHub দিয়ে চালিয়ে যান"}
      </button>
    </div>
  );
}
