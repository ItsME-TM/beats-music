import { NextRequest, NextResponse } from "next/server";

type CachedEntry = { data: any; timestamp: number };

const cache = new Map<string, CachedEntry>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("query") || "").trim();

  if (!q) {
    return NextResponse.json({ error: "No query" }, { status: 400 });
  }

  const cacheKey = q.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
      q,
    )}&type=video&videoCategoryId=10&key=${API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error(
        "YouTube API responded with non-OK status",
        res.status,
        text,
      );
      return NextResponse.json({ error: "YouTube API error" }, { status: 502 });
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const payload = {
      videoId: data.items[0].id.videoId,
      results: data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.default?.url ||
          null,
        channelTitle: item.snippet.channelTitle,
      })),
    };

    cache.set(cacheKey, { data: payload, timestamp: Date.now() });

    return NextResponse.json(payload);
  } catch (e) {
    console.error("YouTube API Error:", e);
    return NextResponse.json({ error: "YouTube API failed" }, { status: 500 });
  }
}
