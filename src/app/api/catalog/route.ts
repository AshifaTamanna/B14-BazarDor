import { NextResponse } from "next/server";
import { BazarApiError, getCategories, getProducts } from "@/lib/bazar-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [categories, products] = await Promise.all([
      getCategories(),
      getProducts(),
    ]);
    return NextResponse.json({ categories, products });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "বাজারের তথ্য আনা যায়নি।";
    const status = error instanceof BazarApiError ? error.status ?? 502 : 502;
    console.error("Catalog request failed:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
