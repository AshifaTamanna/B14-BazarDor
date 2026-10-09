"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { CircleUserRound, Mail, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function ProfileContent({
  editing = false,
  initialName,
}: {
  editing?: boolean;
  initialName: string;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      toast("আপনার প্রোফাইল দেখতে সাইন ইন করুন।", { icon: "🔐" });
      router.replace("/signin?protected=1&next=/profile");
    }
  }, [isPending, router, session]);

  async function updateName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updatedName = name.trim();
    if (updatedName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    setSaving(true);
    try {
      const result = await authClient.updateUser({ name: updatedName });
      if (result.error) {
        toast.error(result.error.message || "তথ্য আপডেট করা যায়নি।");
        return;
      }
      toast.success("আপনার নাম সফলভাবে আপডেট হয়েছে।");
      router.replace("/profile");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "তথ্য আপডেট করা যায়নি।",
      );
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session) {
    return (
      <section className="page-container profile-loading" aria-busy="true">
        <div className="skeleton skeleton-profile" />
      </section>
    );
  }

  const user = session.user;

  return (
    <section className="profile-page page-container">
      <div className="profile-page-heading">
        <h1>আমার প্রোফাইল</h1>
        <p>আপনার অ্যাকাউন্টের তথ্য দেখুন ও হালনাগাদ করুন।</p>
      </div>
      <div className="profile-summary-card">
        <div className="profile-avatar">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt="" />
          ) : (
            <CircleUserRound size={34} />
          )}
        </div>
        <div className="profile-summary-copy">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
        <Link
          className="profile-update-link"
          href={editing ? "/profile" : "/profile/update"}
        >
          <Pencil size={13} />
          {editing ? "প্রোফাইল দেখুন" : "তথ্য আপডেট"}
        </Link>
      </div>

      {editing ? (
        <section className="profile-info-card" aria-labelledby="profile-info-title">
          <h2 id="profile-info-title">তথ্য</h2>
          <form className="auth-form profile-update-form" onSubmit={updateName}>
            <label className="form-field">
              <span>নাম</span>
              <input
                className="profile-name-input"
                autoComplete="name"
                minLength={2}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
            <button
              className="button button-primary auth-submit"
              disabled={saving}
              type="submit"
            >
              {saving ? "আপডেট হচ্ছে..." : "তথ্য আপডেট"}
            </button>
          </form>
        </section>
      ) : (
        <section className="profile-info-card" aria-labelledby="profile-info-title">
          <h2 id="profile-info-title">অ্যাকাউন্টের তথ্য</h2>
          <div className="profile-information">
            <div>
              <span>নাম</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span>ইমেইল ঠিকানা</span>
              <strong>
                <Mail size={15} />
                {user.email}
              </strong>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
