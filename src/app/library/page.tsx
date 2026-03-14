"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import YourPlayLists, { Playlist } from "@/components/YourPlayLists";
import Image from "next/image";
import { MdFavorite, MdMusicNote } from "react-icons/md";

type LikedSong = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

export default function LibraryPage() {
  const user = useAuth();
  const router = useRouter();
  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

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
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 md:pl-8 lg:pl-12 md:pr-[70px] lg:pr-[100px] pt-6 pb-24 md:pb-8">
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

        {likedSongs.length === 0 ? (
          <div className="bg-neutral-900 rounded-xl p-6 text-center">
            <MdFavorite className="text-gray-600 text-4xl mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No liked songs yet.</p>
            <p className="text-gray-500 text-xs mt-1">
              Like songs while listening to see them here.
            </p>
          </div>
        ) : (
          <div className="bg-neutral-900 rounded-xl overflow-hidden">
            {likedSongs.map((song, index) => (
              <button
                key={song.id}
                type="button"
                onClick={() => router.push(`/songPlay?id=${song.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 transition-colors text-left ${
                  index !== likedSongs.length - 1
                    ? "border-b border-white/5"
                    : ""
                }`}
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
                  <p className="text-sm font-medium text-white truncate">
                    {song.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {song.artist}
                  </p>
                </div>
                <span className="text-xs text-gray-500 shrink-0">
                  {song.duration}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Your Playlists */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MdMusicNote className="text-cyan-400 text-xl" />
          <h2 className="text-lg font-semibold">Your Playlists</h2>
        </div>

        {playlists.length === 0 ? (
          <div className="bg-neutral-900 rounded-xl p-6 text-center">
            <MdMusicNote className="text-gray-600 text-4xl mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No playlists yet.</p>
            <p className="text-gray-500 text-xs mt-1">
              Create a playlist to organize your music.
            </p>
          </div>
        ) : (
          <YourPlayLists playlists={playlists} />
        )}
      </section>
    </div>
  );
}
