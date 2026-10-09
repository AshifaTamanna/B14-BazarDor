import { SkeletonGrid } from "@/components/skeleton-grid";

export default function HomeLoading() {
  return (
    <div className="page-container page-loading" aria-busy="true">
      <div className="skeleton skeleton-hero" />
      <div className="skeleton skeleton-section-heading" />
      <SkeletonGrid count={6} />
    </div>
  );
}
