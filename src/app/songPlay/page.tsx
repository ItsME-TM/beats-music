"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import SongPlayer from "@/components/SongPlayer";
import QueuePanel from "@/components/QueuePanel";
import { TopSong } from "@/components/TopGlobalSongs";
import { searchSongs, getSongDetails, SaavnSong } from "@/services/jioSaavnApi";
import { getSongImage, getDownloadUrl } from "@/utils/imageUtils";
import { searchYouTube } from "@/services/youtubeService";

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
  const displayCover = youtubeThumb || currentImage;
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
          coverUrl={displayCover}
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
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <SongPlayContent />
    </Suspense>
  );
}
