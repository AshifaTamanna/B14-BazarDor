import type { Category, Product } from "@/types/bazar";
import snapshot from "@/data/bazar-snapshot.json";

const API_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];
const UPSTREAM_COOLDOWN_MS = 5 * 60 * 1000;
const snapshotProducts = snapshot.products as Product[];
let upstreamCooldownUntil = 0;

export class BazarApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "BazarApiError";
  }
}

async function request<T>(
  path: string,
  fallback: () => T,
): Promise<T> {
  if (Date.now() < upstreamCooldownUntil) {
    return fallback();
  }

  const failures: string[] = [];
  for (const apiUrl of API_URLS) {
    try {
      const response = await fetch(`${apiUrl}${path}`, {
        next: { revalidate: 300 },
      });
      if (!response.ok) {
        failures.push(`${apiUrl}: HTTP ${response.status}`);
        continue;
      }

      const data = (await response.json()) as T;
      upstreamCooldownUntil = 0;
      return data;
    } catch (error) {
      failures.push(
        `${apiUrl}: ${error instanceof Error ? error.message : "request failed"}`,
      );
    }
  }

  upstreamCooldownUntil = Date.now() + UPSTREAM_COOLDOWN_MS;
  console.warn(
    `BazarDor API unavailable; using the saved ${snapshot.capturedAt} catalog snapshot. ${failures.join("; ")}`,
  );
  return fallback();
}

export function getProducts(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const fallback = () =>
    snapshotProducts
      .filter((product) => !category || product.category === category)
      .map((product) => ({ ...product, isStale: true }));
  return request<Product[]>(`/products${query}`, fallback);
}

export function getCategories() {
  return request<Category[]>("/categories", () =>
    snapshot.categories.map((category) => ({ ...category, isStale: true })),
  );
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return null;
  }

  return { ...product, isStale: Boolean(product.isStale) };
}
