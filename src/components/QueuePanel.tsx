"use client";

import React from "react";
import Image from "next/image";
import { TopSong } from "@/components/TopGlobalSongs";
import Skeleton from "@/components/skeleton/Skeleton";

type QueuePanelProps = {
  songs: TopSong[];
  currentSongId: string | null;
  loadingSongId: string | null;
  isLoading?: boolean;
  onSelect: (song: TopSong) => void;
};

function Spinner() {
  return (
    <span
      className="inline-block w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"
      aria-label="Loading"
    />
  );
}

export default function QueuePanel({
  songs,
  currentSongId,
  loadingSongId,
  isLoading,
  onSelect,
}: QueuePanelProps) {
  return (
    <div className="flex flex-col min-h-[50vh] sm:min-h-[60vh] lg:min-h-[75vh] max-h-[50vh] sm:max-h-[60vh] lg:max-h-[75vh] bg-[#0b0b0b] rounded-xl border border-cyan-400/50 px-3 pt-3 pb-3 text-white">
      <h2 className="text-sm font-semibold mb-3 text-white/90">Up Next</h2>
      <div className="overflow-y-auto flex-1 divide-y divide-[#151515]">
        {isLoading ? (
          <div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex items-center gap-3 py-2"
              >
                <Skeleton className="w-8 h-8 rounded-md" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2 w-1/2 mt-2" />
                </div>
                <div className="w-10" />
              </div>
            ))}
          </div>
        ) : (
          songs.map((song) => {
            const isPlaying = String(song.id) === String(currentSongId);
            const isLoading = String(song.id) === String(loadingSongId);
            return (
              <div
                key={song.id}
                onClick={() => onSelect(song)}
                className={`flex items-center gap-3 py-2 cursor-pointer group ${
                  isPlaying ? "border-l-2 border-cyan-400 pl-2" : "pl-0"
                }`}
              >
                <div className="relative w-8 h-8 rounded-md overflow-hidden bg-[#222] shrink-0">
                  <Image
                    src={song.image}
                    alt={song.title}
                    fill
                    sizes="32px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium truncate ${
                      isPlaying ? "text-cyan-400" : "group-hover:text-cyan-400"
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {song.artist}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 w-10 text-right shrink-0">
                  {song.duration}
                </span>
                {isLoading && (
                  <span className="shrink-0">
                    <Spinner />
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
