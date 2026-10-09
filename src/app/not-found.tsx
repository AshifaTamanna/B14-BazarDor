import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="error-page page-container">
      <span className="error-code">৪০৪</span>
      <span className="error-illustration">🧺</span>
      <p className="section-eyebrow">এই পৃষ্ঠাটি পাওয়া যায়নি</p>
      <h1>আপনার খোঁজা পণ্যটি খুঁজে পেলাম না</h1>
      <p>ঠিকানা যাচাই করুন, অথবা সব পণ্যের তালিকায় ফিরে যান।</p>
      <Link className="button button-primary" href="/">
        হোম পেজে ফিরে যান
        <MoveRight size={17} />
      </Link>
    </section>
  );
}
