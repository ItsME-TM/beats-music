"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import SongPlayer from "@/components/SongPlayer";
import QueuePanel from "@/components/QueuePanel";
import { TopSong } from "@/components/TopGlobalSongs";
import { searchSongs, getSongDetails, SaavnSong } from "@/services/jioSaavnApi";
import { getSongImage, getDownloadUrl } from "@/utils/imageUtils";
import { searchYouTube } from "@/services/youtubeService";
import Skeleton from "@/components/skeleton/Skeleton";

function SongPlaySkeleton() {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-6 md:p-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
          <Skeleton className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px] rounded-full" />
          <Skeleton className="h-8 w-48 mt-5" />
          <Skeleton className="h-4 w-32 mt-2" />
          <div className="flex items-center gap-3 mt-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-3" />
          </div>

          <div className="mb-6">
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-3/4 mb-2" />
          </div>

          <div className="mb-6">
            <Skeleton className="h-12 w-full rounded-full" />
          </div>

          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [shuffle, setShuffle] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchTopSongs = async () => {
      const preferredArtists = [
        "Jada Facer",
        "Against the Current",
        "The Chainsmokers",
        "Ariana Grande",
        "Selena Gomez",
        "Kiger",
        "Coldplay",
        "Maroon 5",
        "OneRepublic",
        "Halsey",
        "Taylor Swift",
        "Zedd",
        "Dua Lipa",
        "Imagine Dragons",
        "Kygo",
        "Bebe Rexha",
        "Marshmello",
        "Chvrches",
        "Lauv",
        "Troye Sivan",
        "Hailee Steinfeld",
        "5 Seconds of Summer",
        "Clean Bandit",
        "Griffin",
        "Alessia Cara",
        "Shawn Mendes",
        "Olivia Rodrigo",
        "Paramore",
        "The Weeknd",
        "Ellie Goulding",
      ];

      try {
        const fetchPromises = preferredArtists.map((artist) =>
          searchSongs(artist, 5),
        );
        const allResultsChunks = await Promise.all(fetchPromises);

        const combinedResults = allResultsChunks
          .flat()
          .filter((s): s is SaavnSong => s !== null);

        const shuffled = combinedResults.sort(() => Math.random() - 0.5);

        const mappedSongs: TopSong[] = shuffled.map((s) => ({
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
      } catch (error) {
        console.error("[SongPlay] Failed to fetch custom artist queue:", error);
        const results = await searchSongs("Global Top 100", 20);
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
        setAudioSource("");

        const songWrapper = await getSongDetails(songId);
        if (songWrapper) {
          setCurrentSong(songWrapper);

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
    router.push(`/songPlay?id=${song.id}`);
  };

  const handleNext = () => {
    if (!topSongs.length) return;
    if (shuffle) {
      const currentIndex = topSongs.findIndex(
        (s) => String(s.id) === String(songId),
      );
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * topSongs.length);
      } while (topSongs.length > 1 && randomIndex === currentIndex);
      handleSongSelect(topSongs[randomIndex]);
    } else {
      const currentIndex = topSongs.findIndex(
        (s) => String(s.id) === String(songId),
      );
      const nextIndex = (currentIndex + 1) % topSongs.length;
      handleSongSelect(topSongs[nextIndex]);
    }
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
  // Prefer album artwork (currentImage). If it fails to load, fallback to youtubeThumb.
  const [displayCoverUrl, setDisplayCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Helper to safely set the cover URL only if component is still mounted
    const safeSet = (url: string | null) => {
      if (!cancelled) setDisplayCoverUrl(url);
    };

    // If we have an album image, try to preload it first
    if (currentImage) {
      try {
        const img = new Image();
        img.onload = () => safeSet(currentImage);
        img.onerror = () => safeSet(youtubeThumb || currentImage);
        img.src = currentImage;
        return () => {
          cancelled = true;
          // break reference
          img.onload = null;
          img.onerror = null;
        };
      } catch {
        safeSet(youtubeThumb || currentImage);
      }
    }

    // If no album image, use youtube thumbnail if available
    if (!currentImage && youtubeThumb) {
      safeSet(youtubeThumb);
    }

    return () => {
      cancelled = true;
    };
  }, [currentImage, youtubeThumb]);
  const cleanTitle = currentSong?.name
    ? currentSong.name
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
    : "Select a Song";

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 pt-2 sm:pt-3 md:pt-4 lg:pt-6 px-3 sm:px-4 md:pl-6 lg:pl-10 md:pr-17.5 lg:pr-25 pb-24 md:pb-4">
      <div className="flex-col lg:w-[62%] flex-1 min-w-0">
        <SongPlayer
          title={isAudioLoading ? "Finding HD Stream..." : cleanTitle}
          artists={
            currentSong?.primaryArtists
              ? currentSong.primaryArtists.split(", ")
              : ["Unknown Artist"]
          }
          audioSrc={audioSource}
          youtubeVideoId={youtubeVideoId || undefined}
          coverUrl={displayCoverUrl || undefined}
          duration={currentSong?.duration ? Number(currentSong.duration) : 0}
          lyrics={[]}
          onAddToPlaylist={() => console.log("Add to playlist clicked")}
          onPrev={handlePrev}
          onNext={handleNext}
          onShuffleChange={(s) => setShuffle(s)}
        />
      </div>

      <div className="flex flex-col lg:w-[38%] min-w-0 mt-4 lg:mt-0">
        <QueuePanel
          songs={topSongs}
          currentSongId={songId}
          loadingSongId={isAudioLoading ? songId : null}
          onSelect={handleSongSelect}
        />
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SongPlayPage() {
  return (
    <Suspense fallback={<SongPlaySkeleton />}>
      <SongPlayContent />
    </Suspense>
  );
}
