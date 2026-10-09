import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MoveRight } from "lucide-react";
import { CategoryProductList } from "@/components/category-product-list";
import { MarketDataNotice } from "@/components/market-data-notice";
import { getCategories, getProducts } from "@/lib/bazar-api";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  return { title: category ? `${category.nameBn} বাজারদর` : "বিভাগ পাওয়া যায়নি" };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(slug),
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <section className="category-page page-container">
      <Link className="back-link" href="/">
        <ArrowLeft size={16} />
        হোম পেজ
      </Link>
      <div className="category-hero">
        <span className="category-hero-icon">{category.icon}</span>
        <div>
          <p className="section-eyebrow">বাজার দর · পণ্যের বিভাগ</p>
          <h1>{category.nameBn} এর আজকের দাম</h1>
          <p>
            বাংলাদেশের বিভিন্ন বাজারে {category.nameBn} পণ্যের সর্বশেষ দাম
            দেখুন।
          </p>
        </div>
        <span className="category-count-pill">
          {products.length.toLocaleString("bn-BD")} টি পণ্য
        </span>
      </div>

      {(category.isStale || products.some((product) => product.isStale)) && (
        <MarketDataNotice />
      )}

      {products.length > 0 ? (
        <CategoryProductList products={products} />
      ) : (
        <div className="empty-category">
          <span>🧺</span>
          <h2>এই বিভাগে কোনো পণ্য পাওয়া যায়নি</h2>
          <p>অন্য বিভাগ দেখুন অথবা সব পণ্যে ফিরে যান।</p>
          <Link className="button button-primary" href="/">
            হোম পেজে ফিরে যান
            <MoveRight size={17} />
          </Link>
        </div>
      )}
    </section>
  );
}
