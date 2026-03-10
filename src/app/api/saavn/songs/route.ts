import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "";

  if (!id) {
    return NextResponse.json(
      { status: "ERROR", message: "Song ID is required", data: null },
      { status: 400 },
    );
  }

  // Use iTunes lookup
  try {
    console.log(`[API Proxy] Trying iTunes lookup for ID: ${id}`);
    const url = `https://itunes.apple.com/lookup?id=${id}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const item = data.results[0];
      const songInfo = mapITunesItem(item);

      return NextResponse.json({
        status: "SUCCESS",
        message: null,
        data: [songInfo],
      });
    }
  } catch (error) {
    console.error(`[API Proxy] iTunes lookup fallback failed:`, error);
  }

  return NextResponse.json(
    {
      status: "ERROR",
      message: "All API mirrors and fallback are unavailable",
      data: null,
    },
    { status: 503 },
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapITunesItem(item: any) {
  return {
    id: String(item.trackId),
    name: (item.trackName || item.collectionName || "Unknown Track")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&"),
    album: {
      id: String(item.collectionId || ""),
      name: (item.collectionName || item.trackName || "Unknown Album")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&"),
      url: item.collectionViewUrl || "",
    },
    year: item.releaseDate ? item.releaseDate.substring(0, 4) : "",
    releaseDate: item.releaseDate || "",
    duration: Math.floor((item.trackTimeMillis || 0) / 1000),
    label: item.copyright || "",
    primaryArtists: (item.artistName || "Unknown Artist")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&"),
    artists: [
      {
        id: String(item.artistId || ""),
        name: item.artistName || "Unknown Artist",
        role: "singer",
        image: [],
      },
    ],
    image: [
      { quality: "100x100", link: item.artworkUrl100 || "" },
      { quality: "60x60", link: item.artworkUrl60 || "" },
      {
        quality: "600x600",
        link: (item.artworkUrl100 || "").replace(
          /\/(?:100|150|200)x(?:100|150|200)bb/,
          "/600x600bb",
        ),
      },
    ],
    downloadUrl: [
      { quality: "96kbps", link: item.previewUrl || "" },
      { quality: "160kbps", link: item.previewUrl || "" },
      { quality: "320kbps", link: item.previewUrl || "" },
    ],
  };
}
