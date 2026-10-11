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
      const errorCallback = new URL(window.location.href);
      errorCallback.searchParams.delete("error");
      errorCallback.searchParams.delete("error_description");

      const result = await authClient.signIn.social({
        provider: selectedProvider,
        callbackURL,
        newUserCallbackURL: callbackURL,
        errorCallbackURL: `${errorCallback.pathname}${errorCallback.search}`,
      });
      if (result.error) {
        toast.error(
          result.error.message === "Provider not found"
            ? `${
                selectedProvider === "google" ? "Google" : "GitHub"
              } OAuth চালু নেই। .env.local-এ সংশ্লিষ্ট client ID ও client secret সেট করুন।`
            : result.error.message ||
                `${
                  selectedProvider === "google" ? "Google" : "GitHub"
                } দিয়ে সাইন ইন করা যায়নি।`,
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
