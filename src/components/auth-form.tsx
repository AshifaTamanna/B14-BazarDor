"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { SocialAuthButtons } from "@/components/social-auth-buttons";

export function AuthForm({
  mode,
  nextPath = "/dashboard",
  protectedRedirect = false,
  registered = false,
  authError,
  authConfigured,
}: {
  mode: "signin" | "signup";
  nextPath?: string;
  protectedRedirect?: boolean;
  registered?: boolean;
  authError?: string;
  authConfigured: boolean;
}) {
  const router = useRouter();
  const isSignIn = mode === "signin";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (protectedRedirect) {
      toast("এই পৃষ্ঠাটি দেখতে আগে সাইন ইন করুন।", {
        icon: "🔐",
        id: "protected-page-signin",
      });
    }
    if (registered) {
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।", {
        id: "account-registration-complete",
      });
    }
    if (authError) {
      const errorMessages: Record<string, string> = {
        oauth_provider_not_found:
          "এই OAuth provider কনফিগার করা নেই। .env.local-এ সংশ্লিষ্ট client ID ও client secret সেট করুন।",
        account_not_linked:
          "এই ইমেইলে আগে থেকেই অ্যাকাউন্ট আছে। আগের সাইন-ইন পদ্ধতি ব্যবহার করে প্রবেশ করুন।",
        account_already_linked_to_different_user:
          "এই Google বা GitHub অ্যাকাউন্টটি অন্য একটি অ্যাকাউন্টের সাথে যুক্ত।",
        email_not_verified:
          "এই OAuth অ্যাকাউন্টের ইমেইল যাচাই করা নেই। ইমেইল যাচাই করে আবার চেষ্টা করুন।",
        email_not_found:
          "Google বা GitHub থেকে কোনো ইমেইল পাওয়া যায়নি। ইমেইল অনুমতি দিয়ে আবার চেষ্টা করুন।",
        unable_to_link_account:
          "এই OAuth অ্যাকাউন্টটি যুক্ত করা যায়নি। আগের সাইন-ইন পদ্ধতি দিয়ে প্রবেশ করুন।",
      };
      toast.error(
        errorMessages[authError] || "সামাজিক মাধ্যমে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।",
      );
    }
  }, [authError, protectedRedirect, registered]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSignIn && name.trim().length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    if (!isSignIn && password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignIn) {
        const result = await authClient.signIn.email({
          email: email.trim(),
          password,
        });
        if (result.error) {
          toast.error(result.error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
          return;
        }
        toast.success("স্বাগতম! আপনি সফলভাবে সাইন ইন করেছেন।");
        router.replace(nextPath);
        router.refresh();
      } else {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        if (result.error) {
          toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
          return;
        }
        const signOutResult = await authClient.signOut();
        if (signOutResult.error) {
          toast.error(
            `অ্যাকাউন্ট তৈরি হয়েছে, তবে সাইন আউট করা যায়নি: ${signOutResult.error.message}`,
          );
        }
        router.replace(
          `/signin?registered=1&next=${encodeURIComponent(nextPath)}`,
        );
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!isSignIn) {
    return (
      <section className="signup-page page-container">
        <div className="signup-heading">
          <div className="signup-heading-icon">✳</div>
          <h1>অ্যাকাউন্ট তৈরি করুন</h1>
          <p>নিত্য বাজারের সঠিক দর পেতে নিবন্ধন করে নিন।</p>
        </div>
        <div className="signup-card">
          {!authConfigured && (
            <p className="auth-config-warning" role="status">
              BETTER_AUTH_SECRET সেট করুন। Vercel-এ চালালে MONGODB_URI-ও
              প্রয়োজন।
            </p>
          )}
          <form className="auth-form signup-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>নাম</span>
              <span className="input-wrap">
                <UserRound size={18} />
                <input
                  autoComplete="name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder="যেমন: রহিম উদ্দিন"
                  required
                  value={name}
                />
              </span>
            </label>
            <label className="form-field">
              <span>ইমেইল</span>
              <span className="input-wrap">
                <Mail size={18} />
                <input
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={email}
                />
              </span>
            </label>
            <label className="form-field">
              <span>পাসওয়ার্ড</span>
              <span className="input-wrap">
                <LockKeyhole size={18} />
                <input
                  autoComplete="new-password"
                  minLength={8}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  required
                  type="password"
                  value={password}
                />
              </span>
            </label>
            <label className="form-field">
              <span>পাসওয়ার্ড নিশ্চিত করুন</span>
              <span className="input-wrap">
                <LockKeyhole size={18} />
                <input
                  autoComplete="new-password"
                  minLength={8}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="আবার পাসওয়ার্ড লিখুন"
                  required
                  type="password"
                  value={confirmPassword}
                />
              </span>
            </label>
            <button
              className="button button-primary auth-submit"
              disabled={submitting || !authConfigured}
              type="submit"
            >
              {submitting ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
              <ArrowRight size={17} />
            </button>
          </form>
          <div className="auth-separator">
            <span />
            <span>অথবা</span>
            <span />
          </div>
          <SocialAuthButtons callbackURL={nextPath} />
          <p className="auth-switch">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href={
                nextPath === "/"
                  ? "/signin"
                  : `/signin?next=${encodeURIComponent(nextPath)}`
              }
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>
        <Link className="signup-back-link" href="/">
          ← হোম পেজে ফিরে যান
        </Link>
      </section>
    );
  }

  return (
    <section className="signin-page page-container">
      <div className="signin-heading">
        <h1>সাইন ইন</h1>
        <p>নির্ভরযোগ্য বাজার দর ও দামের বিস্তারিত তথ্য দেখুন।</p>
      </div>
      <div className="signin-card">
        {!authConfigured && (
          <p className="auth-config-warning" role="status">
            BETTER_AUTH_SECRET সেট করুন। Vercel-এ চালালে MONGODB_URI-ও
            প্রয়োজন।
          </p>
        )}
        <form className="auth-form signin-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>ইমেইল</span>
            <span className="input-wrap">
              <Mail size={18} />
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </span>
          </label>
          <label className="form-field">
            <span>পাসওয়ার্ড</span>
            <span className="input-wrap">
              <LockKeyhole size={18} />
              <input
                autoComplete="current-password"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="আপনার পাসওয়ার্ড"
                required
                type="password"
                value={password}
              />
            </span>
          </label>
          <button
            className="button button-primary auth-submit"
            disabled={submitting || !authConfigured}
            type="submit"
          >
            {submitting ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>
        <div className="auth-separator">
          <span />
          <span>অথবা</span>
          <span />
        </div>
        <SocialAuthButtons callbackURL={nextPath} />
        <p className="auth-switch">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href={
              nextPath === "/"
                ? "/signup"
                : `/signup?next=${encodeURIComponent(nextPath)}`
            }
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>
      <Link className="signin-back-link" href="/">
        ← হোম পেজে ফিরে যান
      </Link>
    </section>
  );

}
