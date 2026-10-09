"use client";

import { useEffect } from "react";
import { MoveRight, RotateCw } from "lucide-react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page failed to load:", error);
  }, [error]);

  return (
    <section className="error-page page-container">
      <span className="error-illustration">🌱</span>
      <p className="section-eyebrow">একটু সমস্যা হয়েছে</p>
      <h1>তথ্য লোড করা যায়নি</h1>
      <p>সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।</p>
      <div className="error-actions">
        <button className="button button-primary" onClick={reset} type="button">
          আবার চেষ্টা করুন
          <RotateCw size={16} />
        </button>
        <Link className="button button-quiet" href="/">
          হোম পেজে ফিরে যান
          <MoveRight size={16} />
        </Link>
      </div>
    </section>
  );
}
