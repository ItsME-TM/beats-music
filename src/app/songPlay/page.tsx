"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import SongPlayer from "@/components/SongPlayer";
import TopGlobalSongs, { TopSong } from "@/components/TopGlobalSongs";
import { searchSongs, getSongDetails, SaavnSong } from "@/services/jioSaavnApi";
import { getSongImage, getDownloadUrl } from "@/utils/imageUtils";
import { searchYouTube } from "@/services/youtubeservice";

function SongPlayContent() {
  const user = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const songId = searchParams.get("id");

  const [currentSong, setCurrentSong] = useState<SaavnSong | null>(null);
  const [topSongs, setTopSongs] = useState<TopSong[]>([]);
  const [audioSource, setAudioSource] = useState<string>("");
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [youtubeThumb, setYoutubeThumb] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchTopSongs = async () => {
      const results = await searchSongs("Global Top 100", 20); // Fetch top 20 for the list
      if (results) {
        const mappedSongs: TopSong[] = results.map((s) => ({
          id: s.id,
          title: s.name
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&amp;/g, "&"),
          artist: s.primaryArtists || "",
          duration: formatDuration(s.duration),
          image: getSongImage(s),
          isFavorite: false,
        }));
        setTopSongs(mappedSongs);
      }
    };
    fetchTopSongs();
  }, []);

  useEffect(() => {
    const handleSearchQuery = async () => {
      const q = searchParams.get("q");
      if (q && !songId) {
        setIsAudioLoading(true);
        try {
          const results = await searchSongs(q, 1);
          if (results && results.length > 0) {
            // Redirect to the actual song ID so the main player effect takes over
            router.replace(`/songPlay?id=${results[0].id}`);
          } else {
            setIsAudioLoading(false);
          }
        } catch {
          setIsAudioLoading(false);
        }
      }
    };
    handleSearchQuery();
  }, [searchParams, songId, router]);

  useEffect(() => {
    const loadSongAndYTPlay = async () => {
      if (songId) {
        setIsAudioLoading(true);
        // Clear previous audio source to stop playback immediately
        setAudioSource("");

        const songWrapper = await getSongDetails(songId);
        if (songWrapper) {
          setCurrentSong(songWrapper);

          // Try to get YouTube video ID for full audio via ReactPlayer
          try {
            const query = `${songWrapper.name} ${songWrapper.primaryArtists}`;
            console.log(`[YouTube] Searching for: ${query}`);
            const vid = await searchYouTube(query);
            if (vid) {
              console.log(`[YouTube] Video ID: ${vid.videoId}`);
              setYoutubeVideoId(vid.videoId);
              setYoutubeThumb(vid.thumbnail ?? null);
              setAudioSource("");
              setIsAudioLoading(false);
              return;
            }
          } catch (e) {
            console.error("YouTube lookup failed", e);
          }

          // Fallback to Saavn/iTunes preview
          console.log(
            `[YouTube] Fallback to preview audio. previewUrl=`,
            getDownloadUrl(songWrapper),
          );
          setYoutubeVideoId(null);
          setYoutubeThumb(null);
          setAudioSource(getDownloadUrl(songWrapper));
        }
        setIsAudioLoading(false);
      }
    };
    loadSongAndYTPlay();
  }, [songId]);

  const handleSongSelect = async (song: TopSong) => {
    // Navigate to set the ID in the URL, which triggers the fetchCurrentSong effect
    router.push(`/songPlay?id=${song.id}`);
  };

  const handleNext = () => {
    if (!topSongs.length) return;
    const currentIndex = topSongs.findIndex(
      (s) => String(s.id) === String(songId),
    );
    const nextIndex = (currentIndex + 1) % topSongs.length;
    handleSongSelect(topSongs[nextIndex]);
  };

  const handlePrev = () => {
    if (!topSongs.length) return;
    const currentIndex = topSongs.findIndex(
      (s) => String(s.id) === String(songId),
    );
    const prevIndex = (currentIndex - 1 + topSongs.length) % topSongs.length;
    handleSongSelect(topSongs[prevIndex]);
  };

  const currentImage = getSongImage(currentSong, "");
  const displayCover = youtubeThumb || currentImage;
  const cleanTitle = currentSong?.name
    ? currentSong.name
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
    : "Select a Song";
  const cleanArtist = currentSong?.primaryArtists || "Unknown Artist";

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 pt-2 sm:pt-3 md:pt-4 lg:pt-6 px-3 sm:px-4 md:pl-6 lg:pl-10 md:pr-[70px] lg:pr-[100px] pb-4">
      <div className="flex-col lg:w-[62%] flex-1 min-w-0 space-y-4">
        <SongPlayer
          title={
            isAudioLoading
              ? "Finding HD Stream..."
              : cleanTitle
          }
          artists={
            currentSong?.primaryArtists
              ? currentSong.primaryArtists.split(", ")
              : ["Unknown Artist"]
          }
          audioSrc={audioSource}
          youtubeVideoId={youtubeVideoId || undefined}
          coverUrl={displayCover}
          duration={currentSong?.duration ? Number(currentSong.duration) : 0}
          lyrics={[]} // Lyrics API not integrated yet
          onAddToPlaylist={() => console.log("Add to playlist clicked")}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/80 mb-2">
              Now Playing
            </p>
            <h3 className="text-lg font-bold text-white line-clamp-1">{cleanTitle}</h3>
            <p className="text-sm text-white/70 mt-1 line-clamp-1">{cleanArtist}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
              <span className="px-2 py-1 rounded-full bg-white/10">{youtubeVideoId ? "YouTube Source" : "Preview Source"}</span>
              <span className="px-2 py-1 rounded-full bg-white/10">
                {currentSong?.duration ? formatDuration(Number(currentSong.duration)) : "--:--"}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/80 mb-2">
              Queue Summary
            </p>
            <div className="flex items-end gap-6">
              <div>
                <p className="text-2xl font-extrabold text-white leading-none">{topSongs.length}</p>
                <p className="text-xs text-white/60 mt-1">songs loaded</p>
              </div>
              <div className="w-px h-8 bg-white/15" />
              <div>
                <p className="text-2xl font-extrabold text-cyan-300 leading-none">
                  {songId ? topSongs.findIndex((s) => String(s.id) === String(songId)) + 1 : 0}
                </p>
                <p className="text-xs text-white/60 mt-1">current position</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:w-[38%] min-w-0 mt-4 lg:mt-0 gap-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-3 flex items-center gap-3">
          {displayCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayCover} alt={cleanTitle} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-white/10" />
          )}
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300/80">Active Track</p>
            <p className="text-sm font-semibold text-white truncate">{cleanTitle}</p>
            <p className="text-xs text-white/60 truncate">{cleanArtist}</p>
          </div>
        </div>

        <div className="mt-2">
          <TopGlobalSongs
            songs={topSongs}
            onSelect={handleSongSelect}
            onToggleFavorite={(song, fav) =>
              console.log("Fav toggled", song.title, fav)
            }
          />
        </div>
      </div>
    </div>
  );
}

// Helper to format duration from seconds to mm:ss
function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SongPlayPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <SongPlayContent />
    </Suspense>
  );
}
