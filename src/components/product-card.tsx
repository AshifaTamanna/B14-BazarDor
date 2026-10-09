import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { formatPrice, formatUnit } from "@/lib/format";
import type { Product } from "@/types/bazar";
import { PriceBadge } from "@/components/price-badge";

export function ProductCard({ product }: { product: Product }) {
  const rising = product.change.dir === "up";
  const falling = product.change.dir === "down";

  return (
    <Link
      className="product-card"
      href={`/product/${product.slug}`}
      aria-label={`${product.nameBn}, আজকের দাম ${formatPrice(product.today)} টাকা`}
    >
      <div className="product-card-top">
        <span className="product-illustration" aria-hidden="true">
          {product.image}
        </span>
        <span className="product-category">
          {product.categoryIcon} {product.categoryNameBn}
        </span>
        <ArrowUpRight className="product-arrow" size={18} aria-hidden="true" />
      </div>
      <div className="product-card-copy">
        <h3>{product.nameBn}</h3>
        <p>{formatUnit(product.unit)}</p>
      </div>
      <div className="product-price-row">
        <div>
          <span className="price-caption">আজকের দাম</span>
          <strong>
            {formatPrice(product.today)} <span>টাকা</span>
          </strong>
        </div>
        <PriceBadge product={product} />
      </div>
      <div
        className={`product-card-trend product-card-trend-${product.change.dir}`}
        aria-hidden="true"
      >
        {rising ? (
          <TrendingUp size={14} />
        ) : falling ? (
          <TrendingDown size={14} />
        ) : (
          <span className="flat-line" />
        )}
        <span>গতকালের তুলনায়</span>
      </div>
    </Link>
  );
}
