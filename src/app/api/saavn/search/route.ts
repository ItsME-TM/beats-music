import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const limit = searchParams.get("limit") || "10";

  if (!query) {
    return NextResponse.json(
      { status: "ERROR", message: "Query parameter is required", data: null },
      { status: 400 },
    );
  }

  // Use iTunes API as the primary data source
  try {
    const iTunesData = await fetchITunesData(query, Number(limit));
    if (iTunesData.length > 0) {
      return NextResponse.json({
        status: "SUCCESS",
        message: null,
        data: {
          total: iTunesData.length,
          start: 1,
          results: iTunesData,
        },
      });
    }
  } catch (error) {
    console.error(`[API Proxy] iTunes fallback failed:`, error);
  }

  // Absolute last resort - static mock data
  return NextResponse.json({
    status: "SUCCESS",
    message: null,
    data: {
      total: 7,
      start: 1,
      results: getMockSongs(),
    },
  });
}

async function fetchITunesData(query: string, limit: number) {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.results.map((item: any) => mapITunesItem(item));
  } catch (e) {
    console.error("iTunes fetch error:", e);
    return [];
  }
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

function getMockSongs() {
  return [
    {
      id: "mock-1",
      name: "Blinding Lights",
      album: { id: "a1", name: "After Hours", url: "" },
      year: "2020",
      releaseDate: "2020-03-20",
      duration: 200,
      label: "Republic Records",
      primaryArtists: "The Weeknd",
      artists: [{ id: "ar1", name: "The Weeknd", role: "singer", image: [] }],
      image: [],
      downloadUrl: [],
    },
    {
      id: "mock-2",
      name: "Shape of You",
      album: { id: "a2", name: "÷ (Divide)", url: "" },
      year: "2017",
      releaseDate: "2017-01-06",
      duration: 234,
      label: "Atlantic Records",
      primaryArtists: "Ed Sheeran",
      artists: [{ id: "ar2", name: "Ed Sheeran", role: "singer", image: [] }],
      image: [],
      downloadUrl: [],
    },
    {
      id: "mock-3",
      name: "Levitating",
      album: { id: "a3", name: "Future Nostalgia", url: "" },
      year: "2020",
      releaseDate: "2020-03-27",
      duration: 203,
      label: "Warner Records",
      primaryArtists: "Dua Lipa",
      artists: [{ id: "ar3", name: "Dua Lipa", role: "singer", image: [] }],
      image: [],
      downloadUrl: [],
    },
    {
      id: "mock-4",
      name: "Stay",
      album: { id: "a4", name: "Stay", url: "" },
      year: "2021",
      releaseDate: "2021-07-09",
      duration: 138,
      label: "Columbia Records",
      primaryArtists: "The Kid LAROI, Justin Bieber",
      artists: [
        { id: "ar4", name: "The Kid LAROI", role: "singer", image: [] },
        { id: "ar5", name: "Justin Bieber", role: "singer", image: [] },
      ],
      image: [],
      downloadUrl: [],
    },
    {
      id: "mock-5",
      name: "As It Was",
      album: { id: "a5", name: "Harry's House", url: "" },
      year: "2022",
      releaseDate: "2022-04-01",
      duration: 167,
      label: "Columbia Records",
      primaryArtists: "Harry Styles",
      artists: [{ id: "ar6", name: "Harry Styles", role: "singer", image: [] }],
      image: [],
      downloadUrl: [],
    },
    {
      id: "mock-6",
      name: "Anti-Hero",
      album: { id: "a6", name: "Midnights", url: "" },
      year: "2022",
      releaseDate: "2022-10-21",
      duration: 201,
      label: "Republic Records",
      primaryArtists: "Taylor Swift",
      artists: [{ id: "ar7", name: "Taylor Swift", role: "singer", image: [] }],
      image: [],
      downloadUrl: [],
    },
    {
      id: "mock-7",
      name: "Heat Waves",
      album: { id: "a7", name: "Dreamland", url: "" },
      year: "2020",
      releaseDate: "2020-06-29",
      duration: 239,
      label: "Wolf Tone",
      primaryArtists: "Glass Animals",
      artists: [
        { id: "ar8", name: "Glass Animals", role: "singer", image: [] },
      ],
      image: [],
      downloadUrl: [],
    },
  ];
}
