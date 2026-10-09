import { getReadyAuth } from "@/lib/auth";
import { isAuthConfigured } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "Authentication is not configured. Set BETTER_AUTH_SECRET." },
      { status: 503 },
    );
  }
  return (await getReadyAuth()).handler(request);
}

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "Authentication is not configured. Set BETTER_AUTH_SECRET." },
      { status: 503 },
    );
  }
  return (await getReadyAuth()).handler(request);
}
