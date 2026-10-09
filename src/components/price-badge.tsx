import { formatChange } from "@/lib/format";
import type { Product } from "@/types/bazar";

export function PriceBadge({ product }: { product: Product }) {
  return (
    <span className={`price-badge price-badge-${product.change.dir}`}>
      {formatChange(product)}
    </span>
  );
}
