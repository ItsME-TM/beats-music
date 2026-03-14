"use client";

import React from "react";
import Image from "next/image";
import { TopSong } from "@/components/TopGlobalSongs";

type QueuePanelProps = {
  songs: TopSong[];
  currentSongId: string | null;
  loadingSongId: string | null;
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
  onSelect,
}: QueuePanelProps) {
  return (
    <div className="flex flex-col h-full bg-[#0b0b0b] rounded-xl px-3 pt-3 pb-3 text-white">
      <h2 className="text-sm font-semibold mb-3 text-white/90">Up Next</h2>
      <div className="overflow-y-auto flex-1 divide-y divide-[#151515]">
        {songs.map((song) => {
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
              <div className="relative w-8 h-8 rounded-md overflow-hidden bg-[#222] flex-shrink-0">
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
              <span className="text-[11px] text-gray-400 w-10 text-right flex-shrink-0">
                {song.duration}
              </span>
              {isLoading && (
                <span className="flex-shrink-0">
                  <Spinner />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
