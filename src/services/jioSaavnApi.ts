export interface SaavnSong {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    url: string;
  };
  year: string;
  releaseDate: string;
  duration: number; // in seconds
  label: string;
  primaryArtists: string;
  artists: {
    id: string;
    name: string;
    role: string;
    image: { quality: string; link: string }[];
  }[];
  image: { quality: string; link: string }[];
  downloadUrl: { quality: string; link: string }[];
}

export interface SaavnSearchResponse {
  status: string;
  message: string | null;
  data: {
    total: number;
    start: number;
    results: SaavnSong[];
  };
}

// Use our own Next.js API proxy to avoid CORS issues
// The proxy tries multiple JioSaavn API mirrors and falls back to mock data
const PROXY_BASE = "/api/saavn";

export const searchSongs = async (query: string, limit: number = 10): Promise<SaavnSong[]> => {
  try {
    const url = `${PROXY_BASE}/search?query=${encodeURIComponent(query)}&page=1&limit=${limit}`;
    //console.log("Fetching songs via proxy:", url);
    const response = await fetch(url);
    const data: SaavnSearchResponse = await response.json();
    //console.log("Search response:", data);
    
    if (data.status === "SUCCESS" && data.data.results) {
      return data.data.results;
    }
    return [];
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

export const getSongDetails = async (id: string): Promise<SaavnSong | null> => {
    try {
        const url = `${PROXY_BASE}/songs?id=${id}`;
        //console.log("Fetching song details via proxy:", url);
        const response = await fetch(url);
        const data = await response.json();
        //console.log("Song details response:", data);

        if(data.status === "SUCCESS" && data.data) {
             if(Array.isArray(data.data)) return data.data[0];
             return data.data;
        }
        return null;
    } catch (error) {
        console.error("Error fetching song details:", error);
        return null;
    }
}
