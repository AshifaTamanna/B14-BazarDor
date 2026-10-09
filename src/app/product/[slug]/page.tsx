import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getReadyAuth, isAuthConfigured } from "@/lib/auth";
import { getProductBySlug } from "@/lib/bazar-api";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replaceAll("-", " ") };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  if (!isAuthConfigured()) {
    redirect(`/signin?protected=1&next=${encodeURIComponent(`/product/${slug}`)}`);
  }

  const auth = await getReadyAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/signin?protected=1&next=${encodeURIComponent(`/product/${slug}`)}`);
  }

  return <ProductDetail product={product} />;
}
