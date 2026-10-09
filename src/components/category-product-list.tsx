"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@/types/bazar";

type SortOrder = "default" | "ascending" | "descending";

export function CategoryProductList({ products }: { products: Product[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const sortedProducts = useMemo(() => {
    if (sortOrder === "default") {
      return products;
    }
    return [...products].sort((a, b) =>
      sortOrder === "ascending" ? a.today - b.today : b.today - a.today,
    );
  }, [products, sortOrder]);

  return (
    <>
      <div className="category-controls">
        <span className="category-result-count">
          <SlidersHorizontal size={16} />
          {products.length.toLocaleString("bn-BD")} টি পণ্য পাওয়া গেছে
        </span>
        <label className="sort-select-wrap">
          <span>সাজান:</span>
          <select
            aria-label="দামের ভিত্তিতে পণ্য সাজান"
            onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            value={sortOrder}
          >
            <option value="default">ডিফল্ট</option>
            <option value="ascending">দাম: কম থেকে বেশি</option>
            <option value="descending">দাম: বেশি থেকে কম</option>
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </label>
      </div>
      <ProductGrid products={sortedProducts} />
    </>
  );
}
