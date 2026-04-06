"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth, { usePlayer } from "@/hooks/useAuth";
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
  const player = usePlayer();
  const { setTrack } = player;
  const router = useRouter();
  const searchParams = useSearchParams();
  const songId = searchParams.get("id");
  const playerTrackRef = useRef(player.track);

  const [currentSong, setCurrentSong] = useState<SaavnSong | null>(null);
  const [topSongs, setTopSongs] = useState<TopSong[]>([]);
  const [youtubeThumb, setYoutubeThumb] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "oldgold" | "slowed" | "latest" | "sinhala"
  >("oldgold");
  const fetchIdRef = useRef(0);
  const [isTabLoading, setIsTabLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    playerTrackRef.current = player.track;
  }, [player.track]);

  // Fetch songs for each tab
  useEffect(() => {
    let isActive = true;
    const thisFetchId = ++fetchIdRef.current;

    const fetchTabSongs = async () => {
      setIsTabLoading(true);
      setTopSongs([]); // clear immediately
      let mappedSongs: TopSong[] = [];
      try {
        if (selectedTab === "oldgold") {
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
          const fetchPromises = preferredArtists.map((artist) =>
            searchSongs(artist, 5),
          );
          const allResultsChunks = await Promise.all(fetchPromises);
          const combinedResults = allResultsChunks
            .flat()
            .filter((s): s is SaavnSong => s !== null);
          const shuffled = combinedResults.sort(() => Math.random() - 0.5);
          mappedSongs = shuffled.map((s) => ({
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
        } else if (selectedTab === "slowed") {
          const results = await searchSongs("slowed reverb", 100);
          mappedSongs = results.map((s) => ({
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
        } else if (selectedTab === "latest") {
          const results = await searchSongs("latest english songs", 100);
          mappedSongs = results.map((s) => ({
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
        } else if (selectedTab === "sinhala") {
          const results = await searchSongs("sinhala songs", 100);
          mappedSongs = results.map((s) => ({
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
        }

        // ignore stale responses
        if (!isActive || thisFetchId !== fetchIdRef.current) return;
        setTopSongs(mappedSongs);
      } catch (error) {
        if (!isActive || thisFetchId !== fetchIdRef.current) return;
        console.error("[SongPlay] Failed to fetch tab songs:", error);
        setTopSongs([]);
      } finally {
        if (!isActive || thisFetchId !== fetchIdRef.current) return;
        setIsTabLoading(false);
      }
    };
    fetchTabSongs();

    return () => {
      isActive = false;
    };
  }, [selectedTab]);

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

        const songWrapper = await getSongDetails(songId);
        if (songWrapper) {
          setCurrentSong(songWrapper);

          const nextBaseTrack = {
            id: String(songWrapper.id),
            title: songWrapper.name
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
              .replace(/&amp;/g, "&"),
            artists: songWrapper.primaryArtists
              ? songWrapper.primaryArtists.split(", ")
              : ["Unknown Artist"],
            coverUrl: getSongImage(songWrapper, ""),
            duration: songWrapper.duration ? Number(songWrapper.duration) : 0,
          };

          try {
            const query = `${songWrapper.name} ${songWrapper.primaryArtists}`;
            console.log(`[YouTube] Searching for: ${query}`);
            const vid = await searchYouTube(query);
            if (vid) {
              console.log(`[YouTube] Video ID: ${vid.videoId}`);
              setYoutubeThumb(vid.thumbnail ?? null);

              const activeTrack = playerTrackRef.current;
              const shouldReplaceTrack =
                !activeTrack ||
                activeTrack.id !== String(songWrapper.id) ||
                activeTrack.youtubeVideoId !== vid.videoId;

              if (shouldReplaceTrack) {
                setTrack(
                  {
                    ...nextBaseTrack,
                    youtubeVideoId: vid.videoId,
                    audioSrc: "",
                  },
                  true,
                );
              }

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
          setYoutubeThumb(null);

          const previewUrl = getDownloadUrl(songWrapper);
          const activeTrack = playerTrackRef.current;
          const shouldReplaceTrack =
            !activeTrack ||
            activeTrack.id !== String(songWrapper.id) ||
            activeTrack.audioSrc !== previewUrl ||
            !!activeTrack.youtubeVideoId;

          if (shouldReplaceTrack) {
            setTrack(
              {
                ...nextBaseTrack,
                audioSrc: previewUrl,
                youtubeVideoId: undefined,
              },
              true,
            );
          }
        }
        setIsAudioLoading(false);
      }
    };
    loadSongAndYTPlay();
  }, [songId, setTrack]);

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
          audioSrc={player.track?.audioSrc}
          youtubeVideoId={player.track?.youtubeVideoId}
          autoplayRequestAt={player.autoplayRequestAt ?? undefined}
          initialSeekTime={player.currentTime}
          coverUrl={player.track?.coverUrl || displayCoverUrl || undefined}
          duration={
            player.track?.duration ||
            (currentSong?.duration ? Number(currentSong.duration) : 0)
          }
          lyrics={[]}
          onAddToPlaylist={() => console.log("Add to playlist clicked")}
          onPrev={handlePrev}
          onNext={handleNext}
          onShuffleChange={(s) => setShuffle(s)}
          onPlayingChange={(playing) => player.setIsPlaying(playing)}
          onTimeChange={(seconds) => player.setCurrentTime(seconds)}
          onVolumeChange={(value) => player.setVolume(value)}
        />
      </div>

      <div className="flex flex-col lg:w-[38%] min-w-0 mt-4 lg:mt-0">
        {/* Tabs above Up Next */}
        <div className="flex gap-2 mb-2">
          <button
            className={`px-3 py-1 rounded-md text-xs font-semibold border transition-colors ${selectedTab === "oldgold" ? "bg-cyan-400 text-black border-cyan-400" : "bg-[#181818] text-white border-[#222] hover:bg-cyan-900/30"}`}
            onClick={() => {
              setTopSongs([]);
              setSelectedTab("oldgold");
            }}
          >
            Old Gold
          </button>
          <button
            className={`px-3 py-1 rounded-md text-xs font-semibold border transition-colors ${selectedTab === "slowed" ? "bg-cyan-400 text-black border-cyan-400" : "bg-[#181818] text-white border-[#222] hover:bg-cyan-900/30"}`}
            onClick={() => {
              setTopSongs([]);
              setSelectedTab("slowed");
            }}
          >
            Slowed Reverb
          </button>
          <button
            className={`px-3 py-1 rounded-md text-xs font-semibold border transition-colors ${selectedTab === "latest" ? "bg-cyan-400 text-black border-cyan-400" : "bg-[#181818] text-white border-[#222] hover:bg-cyan-900/30"}`}
            onClick={() => {
              setTopSongs([]);
              setSelectedTab("latest");
            }}
          >
            Latest
          </button>
          <button
            className={`px-3 py-1 rounded-md text-xs font-semibold border transition-colors ${selectedTab === "sinhala" ? "bg-cyan-400 text-black border-cyan-400" : "bg-[#181818] text-white border-[#222] hover:bg-cyan-900/30"}`}
            onClick={() => {
              setTopSongs([]);
              setSelectedTab("sinhala");
            }}
          >
            Sinhala
          </button>
        </div>
        <QueuePanel
          songs={topSongs}
          currentSongId={songId}
          loadingSongId={isAudioLoading ? songId : null}
          isLoading={isTabLoading}
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
