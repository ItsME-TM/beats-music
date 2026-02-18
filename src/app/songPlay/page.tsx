"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import SongPlayer from "@/components/SongPlayer";
import RecentPlayed from "@/components/RecentPlayed";
import SongReleases, { Release } from "@/components/songReleases";
import TopGlobalSongs, { TopSong } from "@/components/TopGlobalSongs";
import YourPlayLists from "@/components/YourPlayLists";
import { searchSongs, getSongDetails, SaavnSong } from "@/services/jioSaavnApi";
import { getSongImage, getDownloadUrl } from "@/utils/imageUtils";

function SongPlayContent() {
  const user = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const songId = searchParams.get("id");

  const [currentSong, setCurrentSong] = useState<SaavnSong | null>(null);
  const [topSongs, setTopSongs] = useState<TopSong[]>([]);

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
    const fetchCurrentSong = async () => {
      if (songId) {
        const songWrapper = await getSongDetails(songId);
        if (songWrapper) {
             setCurrentSong(songWrapper);
        }
      }
    };
    fetchCurrentSong();
  }, [songId]);

  const handleSongSelect = async (song: TopSong) => {
      const details = await getSongDetails(String(song.id));
      if(details) setCurrentSong(details);
  };

  const currentAudioSrc = getDownloadUrl(currentSong);
  const currentImage = getSongImage(currentSong, "/images/one-of-the-girl-banner.png");

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6 pt-2 sm:pt-3 md:pt-4 lg:pt-6 px-3 sm:px-4 md:pl-6 lg:pl-10 md:pr-[70px] lg:pr-[100px] pb-4">
      <div className="flex-col lg:w-[60%] flex-1 min-w-0">
        <SongPlayer
          title={currentSong?.name ? currentSong.name.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&") : "Select a Song"}
          artists={currentSong?.primaryArtists ? currentSong.primaryArtists.split(", ") : ["Unknown Artist"]}
          audioSrc={currentAudioSrc}
          coverUrl={currentImage}
          duration={currentSong?.duration ? Number(currentSong.duration) : 0}
          lyrics={[]} // Lyrics API not integrated yet
          onAddToPlaylist={() => console.log("Add to playlist clicked")}
          onPrev={() => console.log("Prev")}
          onNext={() => console.log("Next")}
        />
        <div className="pt-2">
          <RecentPlayed
            songs={[
              {
                id: 1,
                title: "All I Want For Christmas Is You",
                artist: "Maria Carey",
                album: "Album",
                duration: "3:54",
                image: "/images/maria.png",
                isFavorite: false,
              },
              {
                id: 2,
                title: "One of the girls",
                artist: "The Weekn & JENNIE...",
                album: "-R-",
                duration: "3:54",
                image: "/images/jennie.png",
                isPlaying: true,
                isFavorite: true,
              },
              {
                id: 3,
                title: "Donda",
                artist: "Kanye West",
                album: "Donda",
                duration: "3:54",
                image: "/images/donda.png",
                isFavorite: false,
              },
            ]}
          />
        </div>
        <div className="min-w-0">
          <SongReleases
            releases={
              [
                {
                  id: 1,
                  title: "Way Back Home",
                  artist: "SHAUN",
                  image: "/images/shawn.jpg",
                },
                {
                  id: 2,
                  title: "Rockabye",
                  artist: "The Clean Bandit",
                  image: "/images/clean_bandith.jpg",
                },
                {
                  id: 3,
                  title: "Graduation",
                  artist: "Kanye West",
                  image: "/images/kanye.png",
                },
                {
                  id: 4,
                  title: "Stay",
                  artist: "Zedd",
                  image: "/images/zedd.jpg",
                },
                {
                  id: 5,
                  title: "abcdefu",
                  artist: "GAYLE",
                  image: "/images/gayle.jpg",
                },
                {
                  id: 6,
                  title: "Bad Habits",
                  artist: "Ed Sheeran",
                  image: "/images/edsheeran.jpg",
                },
                {
                  id: 7,
                  title: "At My Worst",
                  artist: "Pink Sweat$",
                  image: "/images/pink_sweat.jpg",
                },
              ] as Release[]
            }
            onSelect={(r) => console.log("Selected release", r)}
          />
        </div>
      </div>
      <div className="flex flex-col lg:w-[40%] min-w-0 mt-4 lg:mt-0">
        <div className="mt-2">
          <TopGlobalSongs
            songs={topSongs}
            onSelect={handleSongSelect}
            onToggleFavorite={(song, fav) =>
              console.log("Fav toggled", song.title, fav)
            }
          />
        </div>
        <div className="mt-2">
          <YourPlayLists
            playlists={[
              { id: 1, name: "For workplace" },
              { id: 2, name: "Rich Brian's collections" },
              { id: 3, name: "deep focus" },
            ]}
            onSelect={(pl) => console.log("Selected playlist", pl)}
            onAdd={() => console.log("Add playlist clicked")}
            initialActiveId={1}
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
