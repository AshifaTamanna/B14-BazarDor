import { SkeletonGrid } from "@/components/skeleton-grid";

export default function CategoryLoading() {
  return (
    <section className="category-page page-container" aria-busy="true">
      <div className="skeleton skeleton-category-banner" />
      <div className="skeleton skeleton-sort" />
      <SkeletonGrid count={6} />
    </section>
  );
}
