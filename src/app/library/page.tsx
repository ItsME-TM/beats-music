"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { Playlist } from "@/components/YourPlayLists";
import AddPlaylistButton from "@/components/AddPlaylistButton";
import Image from "next/image";
import { MdFavorite, MdMusicNote } from "react-icons/md";
import { sortPlaylists, SortOrder } from "@/utils/sortPlaylists";
import Skeleton from "@/components/skeleton/Skeleton";

const PLAYLIST_GRADIENTS = [
  "from-purple-600 to-blue-500",
  "from-pink-500 to-rose-400",
  "from-orange-500 to-yellow-400",
  "from-teal-500 to-emerald-400",
  "from-cyan-500 to-blue-600",
  "from-red-600 to-orange-500",
];

type LikedSong = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

interface SongRowProps {
  song: LikedSong;
  onClick: (id: string) => void;
}

interface FilterBarProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

interface PlaylistCardProps {
  playlist: Playlist;
  gradientClass: string;
  onSelect: (pl: Playlist) => void;
}

function LikedSongsCard({ count }: { count: number }) {
  return (
    <div
      className="bg-linear-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl p-8 w-full flex flex-col justify-end gap-2"
      style={{ minHeight: "160px" }}
    >
      <MdFavorite className="text-white text-5xl" />
      <p className="text-white font-bold text-2xl">Liked Songs</p>
      <p className="text-gray-300 text-sm">{count} songs</p>
    </div>
  );
}

function SongRow({ song, onClick }: SongRowProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(song.id)}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 transition-colors text-left"
    >
      <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden">
        {song.image ? (
          <Image
            src={song.image}
            alt={song.title}
            width={40}
            height={40}
            className="w-full h-full object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
            <MdMusicNote className="text-gray-400 text-lg" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{song.title}</p>
        <p className="text-xs text-gray-400 truncate">{song.artist}</p>
      </div>
      <span className="text-xs text-gray-500 shrink-0">{song.duration}</span>
    </button>
  );
}

function LikedEmptyState() {
  return (
    <div className="bg-neutral-900 rounded-xl p-8 text-center">
      <MdFavorite className="text-gray-600 text-5xl mx-auto mb-4" />
      <p className="text-white font-semibold mb-2">
        Songs you like will appear here
      </p>
      <p className="text-gray-400 text-sm">
        Start listening to build your library
      </p>
    </div>
  );
}

function FilterBar({ sortOrder, onSortChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-neutral-800 text-cyan-400">
        Playlists
      </span>
      <select
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value as SortOrder)}
        className="ml-auto bg-neutral-800 text-white text-sm rounded-lg px-3 py-1.5 border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-cyan-400"
      >
        <option value="recents">Recents</option>
        <option value="recentlyAdded">Recently Added</option>
        <option value="alpha">Alphabetical</option>
      </select>
    </div>
  );
}

function PlaylistCard({
  playlist,
  gradientClass,
  onSelect,
}: PlaylistCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(playlist)}
      className="group relative w-full aspect-square rounded-xl overflow-hidden hover:scale-105 hover:brightness-110 transition-transform duration-200"
    >
      <div className={`absolute inset-0 bg-linear-to-br ${gradientClass}`}>
        <div className="flex items-center justify-center h-full">
          <MdMusicNote className="text-white/60 text-4xl" />
        </div>
      </div>
      <div className="p-3 bg-neutral-900 rounded-b-xl absolute bottom-0 left-0 right-0">
        <p className="text-sm font-semibold text-white truncate">
          {playlist.name}
        </p>
        {playlist.description && (
          <p className="text-xs text-gray-400 truncate">
            {playlist.description}
          </p>
        )}
      </div>
    </button>
  );
}

function PlaylistsEmptyState() {
  return (
    <div className="bg-neutral-900 rounded-xl p-8 text-center">
      <MdMusicNote className="text-gray-600 text-5xl mx-auto mb-4" />
      <p className="text-white font-semibold mb-2">
        Create your first playlist
      </p>
      <p className="text-gray-400 text-sm">
        It&apos;s easy, we&apos;ll help you
      </p>
    </div>
  );
}

function LibrarySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const user = useAuth();
  const router = useRouter();
  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recents");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    try {
      const raw = localStorage.getItem(`liked_${user.uid}`);
      setLikedSongs(raw ? JSON.parse(raw) : []);
    } catch {
      setLikedSongs([]);
    }

    try {
      const raw = localStorage.getItem(`playlists_${user.uid}`);
      setPlaylists(raw ? JSON.parse(raw) : []);
    } catch {
      setPlaylists([]);
    }

    setIsLoading(false);
  }, [user]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white px-4 md:pl-8 lg:pl-12 md:pr-17.5 lg:pr-25 pt-6 pb-24 md:pb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">Your Library</h1>
        <LibrarySkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 md:pl-8 lg:pl-12 md:pr-17.5 lg:pr-25 pt-6 pb-24 md:pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Your Library</h1>

      {/* Liked Songs */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <MdFavorite className="text-cyan-400 text-xl" />
          <h2 className="text-lg font-semibold">Liked Songs</h2>
          {likedSongs.length > 0 && (
            <span className="text-sm text-gray-400">({likedSongs.length})</span>
          )}
        </div>

        <LikedSongsCard count={likedSongs.length} />

        {likedSongs.length > 0 ? (
          <div className="bg-neutral-900 rounded-xl overflow-hidden mt-4">
            {likedSongs.map((song) => (
              <SongRow
                key={song.id}
                song={song}
                onClick={(id) => router.push(`/songPlay?id=${id}`)}
              />
            ))}
          </div>
        ) : (
          <LikedEmptyState />
        )}
      </section>

      {/* Your Playlists */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MdMusicNote className="text-cyan-400 text-xl" />
          <h2 className="text-lg font-semibold">Your Playlists</h2>
          <div className="ml-auto">
            <AddPlaylistButton
              text="+ New Playlist"
              onClick={() => {
                // existing add playlist behavior - trigger localStorage update
                const newPlaylist: Playlist = {
                  id: Date.now(),
                  name: `Playlist ${playlists.length + 1}`,
                };
                const updated = [...playlists, newPlaylist];
                setPlaylists(updated);
                if (user) {
                  localStorage.setItem(
                    `playlists_${user.uid}`,
                    JSON.stringify(updated),
                  );
                }
              }}
            />
          </div>
        </div>

        <FilterBar sortOrder={sortOrder} onSortChange={setSortOrder} />

        {playlists.length === 0 ? (
          <PlaylistsEmptyState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortPlaylists(playlists, sortOrder).map((pl) => (
              <PlaylistCard
                key={pl.id}
                playlist={pl}
                gradientClass={
                  PLAYLIST_GRADIENTS[pl.id % PLAYLIST_GRADIENTS.length]
                }
                onSelect={(selected) =>
                  console.log("Selected playlist:", selected.name)
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
