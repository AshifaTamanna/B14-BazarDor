import type { Product } from "@/types/bazar";
import { ProductCard } from "@/components/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="empty-products">
        <span aria-hidden="true">🧺</span>
        <p>এই বিভাগে এখনো কোনো পণ্যের তথ্য নেই।</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
