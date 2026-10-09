"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { formatPrice, formatUnit } from "@/lib/format";
import type { Category, Product } from "@/types/bazar";
import { AccountActions } from "@/components/account-actions";

export function SiteHeader({
  formattedDate,
  authConfigured,
}: {
  formattedDate: string;
  authConfigured: boolean;
}) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tickerProducts, setTickerProducts] = useState<Product[]>([]);
  const [catalogStatus, setCatalogStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/catalog", { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "বাজারের তথ্য আনা যায়নি।");
        }
        setCategories(data.categories);
        setTickerProducts(data.products);
        setCatalogStatus("loaded");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setCatalogStatus("error");
        toast.error(
          error instanceof Error ? error.message : "বাজারের তথ্য আনা যায়নি।",
        );
      });

    return () => controller.abort();
  }, []);

  const tickerItems = tickerProducts.slice(0, 12);
  return (
    <header className="site-header">
      <div className="header-main page-container">
        <Link className="brand" href="/" aria-label="বাজার দর হোম পেজ">
          <span className="brand-mark">🛒</span>
          <span className="brand-copy">
            <strong>বাজার দর</strong>
            <small>{formattedDate}</small>
          </span>
        </Link>
        <div className="header-actions">
          {authConfigured ? (
            <AccountActions />
          ) : (
            <>
              <Link className="button button-quiet header-signin" href="/signin">
                সাইন ইন
              </Link>
              <Link className="button button-primary header-signup" href="/signup">
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="category-row">
        <nav
          className="category-nav page-container"
          aria-label="পণ্যের বিভাগ"
        >
          <Link className={`category-link ${pathname === "/" ? "active" : ""}`} href="/">
            সব পণ্য
          </Link>
          {categories.map((category) => (
            <Link
              className={`category-link ${
                pathname === `/category/${category.slug}` ? "active" : ""
              }`}
              href={`/category/${category.slug}`}
              key={category.id}
            >
              <span>{category.icon}</span>
              {category.nameBn}
            </Link>
          ))}
        </nav>
      </div>

      <div className="ticker" aria-label="আজকের পণ্যের দামের হালনাগাদ">
        <span className="ticker-label">
          <span className="live-dot" />
          বাজার দর
          {tickerItems.some((product) => product.isStale) && (
            <span className="ticker-stale-label">সংরক্ষিত</span>
          )}
        </span>
        {tickerItems.length > 0 ? (
          <div className="ticker-window">
            <div className="ticker-track" key={pathname}>
              {[...tickerItems, ...tickerItems].map((product, index) => (
                <span
                  className="ticker-item"
                  key={`${product.id}-${index}`}
                  aria-hidden={index >= tickerItems.length}
                >
                  <span>{product.image}</span>
                  <strong>{product.nameBn}</strong>
                  <span>
                    {formatPrice(product.today)} টাকা/
                    {formatUnit(product.unit).replace("প্রতি ", "")}
                  </span>
                  <span
                    className={`ticker-change ticker-${product.change.dir}`}
                  >
                    {product.change.dir === "up" ? (
                      <ArrowUp size={12} />
                    ) : product.change.dir === "down" ? (
                      <ArrowDown size={12} />
                    ) : null}
                    {product.change.dir === "flat"
                      ? "— ০.০%"
                      : `${Math.abs(product.change.pct).toLocaleString("bn-BD", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}%`}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ) : catalogStatus === "loading" ? (
          <div className="ticker-message">দাম হালনাগাদ করা হচ্ছে...</div>
        ) : (
          <div className="ticker-message">বাজারের তথ্য পাওয়া যায়নি।</div>
        )}
      </div>
    </header>
  );
}
