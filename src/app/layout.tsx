import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import { isAuthConfigured } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "বাজার দর — আজকের বাজারদর",
    template: "%s | বাজার দর",
  },
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম, বাজারভিত্তিক দর এবং মূল্য পরিবর্তনের নির্ভরযোগ্য তথ্য।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const formattedDate = new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <html lang="bn" data-scroll-behavior="smooth">
      <body id="top">
        <Providers>
          <SiteHeader
            authConfigured={isAuthConfigured()}
            formattedDate={formattedDate}
          />
          <main>{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
