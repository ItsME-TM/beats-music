export interface YouTubeSearchResult {
  videoId: string;
  title?: string;
  thumbnail?: string | null;
  channelTitle?: string;
}

export const searchYouTube = async (
  query: string,
): Promise<YouTubeSearchResult | null> => {
  try {
    const res = await fetch(
      `/api/youtube/search?query=${encodeURIComponent(query)}`,
    );
    if (!res.ok) {
      console.warn("/api/youtube/search returned non-ok status", res.status);
      return null;
    }
    const data = await res.json();
    if (!data || !data.videoId) return null;
    const first = data.results?.[0];
    return {
      videoId: data.videoId,
      title: first?.title || undefined,
      thumbnail: first?.thumbnail || null,
      channelTitle: first?.channelTitle || undefined,
    };
  } catch (error) {
    console.error("YouTube search error:", error);
    return null;
  }
};

// Note: Piped-based stream proxy logic has been deprecated in favor of
// embedding YouTube via ReactPlayer (IFrame). If server-side streaming
// proxies are still required in the future, reintroduce a dedicated API
// route with robust error handling and caching.
