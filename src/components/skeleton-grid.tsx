export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="product-grid" aria-label="পণ্যের তথ্য লোড হচ্ছে" role="status">
      {Array.from({ length: count }, (_, index) => (
        <div className="product-skeleton" key={index}>
          <div className="skeleton skeleton-art" />
          <div className="skeleton skeleton-line skeleton-title" />
          <div className="skeleton skeleton-line skeleton-unit" />
          <div className="skeleton skeleton-line skeleton-price" />
        </div>
      ))}
    </div>
  );
}
