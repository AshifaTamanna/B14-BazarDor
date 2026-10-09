import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, MoveRight } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { SectionHeading } from "@/components/section-heading";
import { getProducts } from "@/lib/bazar-api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  const today = new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const risers = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);
  const fallers = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <>
      <section className="hero-section page-container">
        <div className="hero-copy">
          <p className="hero-eyebrow">{today}</p>
          <h1>আজকের বাজারের দাম এক নজরে</h1>
          <p className="hero-description">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত তথ্য, দ্রুত, সর্বনিম্ন-সর্বোচ্চ এবং গড় দামের তুলনায়।
          </p>
          <Link className="button button-primary hero-button" href="#সব-পণ্য">
            সব পণ্য দেখুন
          </Link>
        </div>
        <div className="hero-art-wrap" aria-hidden="true">
          <div className="hero-image">
            <Image
              src="/bazar-hero.png"
              alt=""
              fill
              priority
              sizes="(max-width: 760px) 45vw, 250px"
            />
          </div>
        </div>
      </section>

      <section className="catalog-section page-container">
        <div className="trend-section trend-up">
          <SectionHeading
            eyebrow="বাজারের হালচাল"
            title="আজ দাম বেড়েছে"
            description="গতকালের তুলনায় যেসব পণ্যের দাম ঊর্ধ্বমুখী"
            action={
              <span className="trend-chip trend-chip-up">
                <ArrowUpRight size={16} />
                ঊর্ধ্বমুখী
              </span>
            }
          />
          {risers.length ? (
            <ProductGrid products={risers} />
          ) : (
            <div className="empty-products trend-empty">
              <span>📊</span>
              <p>আজ কোনো পণ্যের দাম বাড়েনি।</p>
            </div>
          )}
        </div>

        <div className="trend-section trend-down">
          <SectionHeading
            eyebrow="আপনার সাশ্রয়ের খবর"
            title="আজ দাম কমেছে"
            description="আজ কিছুটা স্বস্তি—দাম কমেছে যেসব পণ্যের"
            action={
              <span className="trend-chip trend-chip-down">
                <ArrowDownRight size={16} />
                নিম্নমুখী
              </span>
            }
          />
          {fallers.length ? (
            <ProductGrid products={fallers} />
          ) : (
            <div className="empty-products trend-empty">
              <span>🌿</span>
              <p>আজ কোনো পণ্যের দাম কমেনি।</p>
            </div>
          )}
        </div>

        <div className="all-products-section">
          <SectionHeading
            eyebrow="আপনার প্রতিদিনের বাজার"
            title="সব পণ্যের আজকের দাম"
            description="প্রয়োজনীয় সব পণ্যের বাজারদর ও দামের পরিবর্তন এক নজরে দেখুন।"
            id="সব-পণ্য"
            action={
              <span className="product-count">
                {products.length.toLocaleString("bn-BD")} টি পণ্য
              </span>
            }
          />
          <ProductGrid products={products} />
        </div>
      </section>
      <div className="home-bottom-note page-container">
        <span className="note-icon">✳</span>
        <p>স্বচ্ছ বাজার, সচেতন কেনাকাটা — প্রতিদিনের দামে আপনার পাশে।</p>
        <Link href="#top" aria-label="পাতার উপরে যান">
          <MoveRight size={17} />
        </Link>
      </div>
    </>
  );
}
