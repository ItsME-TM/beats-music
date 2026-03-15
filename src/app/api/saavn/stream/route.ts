import { NextRequest, NextResponse } from "next/server";

// Minimal placeholder route to satisfy build when the real implementation
// is not present. Returns 501 Not Implemented so callers know to fallback.
export async function GET(_req: NextRequest) {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export const dynamic = "force-dynamic";
