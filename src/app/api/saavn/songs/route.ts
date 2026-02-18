import { NextRequest, NextResponse } from "next/server";

const API_MIRRORS = [
  "https://saavn.dev/api",
  "https://jiosaavn-api-privatecv.vercel.app",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";

  if (!id) {
    return NextResponse.json(
      { status: "ERROR", message: "Song ID is required", data: null },
      { status: 400 }
    );
  }

  for (const baseUrl of API_MIRRORS) {
    try {
      const url = `${baseUrl}/songs?id=${encodeURIComponent(id)}`;
      console.log(`[API Proxy] Trying song details: ${url}`);

      const response = await fetch(url, {
        headers: { "Accept": "application/json" },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        console.log(`[API Proxy] Mirror ${baseUrl} returned ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`[API Proxy] Song details success from ${baseUrl}`);
      return NextResponse.json(data);
    } catch (error) {
      console.error(`[API Proxy] Mirror ${baseUrl} failed:`, error);
      continue;
    }
  }

  return NextResponse.json(
    { status: "ERROR", message: "All API mirrors are unavailable", data: null },
    { status: 503 }
  );
}
