"use client";

import React from "react";
import AddPlaylistButton from "./AddPlaylistButton";

type LyricLine = {
  time: number;
  text: string;
};

type SongPlayerProps = {
  title: string;
  artists: string[];
  coverUrl?: string;
  lyrics?: LyricLine[];
  onAddToPlaylist?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function SongPlayer({
  title,
  artists,
  coverUrl,
  lyrics = [],
  onAddToPlaylist,
  onPrev,
  onNext,
}: SongPlayerProps) {
  return (
    <div
      className={`w-170 h-80 relative rounded-2xl text-white shadow-lg overflow-hidden ${
        coverUrl
          ? "bg-center bg-cover"
          : "bg-gradient-to-br from-[#0b0f14] to-[#131a21]"
      }`}
      style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* content */}
      <div className="relative flex gap-6 h-full p-6">
        {/* left: song info */}
        <div className="w-2/5 self-center">
          <p className="text-xs font-bold opacity-80 mb-2">FEATURED SONG</p>
          <h1 className="text-xl font-extrabold leading-tight">{title}</h1>
          <p className="mt-2 text-xs opacity-90">{artists.join(" & ")}</p>

          <div className="flex items-center gap-4 mt-4">
            <button aria-label="Like" className="p-2">
              ❤️
            </button>
            <AddPlaylistButton
              text="Add Playlist"
              width="w-20"
              height="h-5"
              onClick={onAddToPlaylist}
            />
          </div>
        </div>

        {/* right: lyrics */}
        <div className="flex-1 self-center">
          {lyrics.length ? (
            <div className="flex flex-col gap-2">
              {lyrics.slice(0, 5).map((l, i) => (
                <div key={i} className="text-lg opacity-90">
                  {l.text}
                </div>
              ))}
            </div>
          ) : (
            <p className="opacity-70 text-sm">No lyrics available.</p>
          )}
          <div className="bg-red mt-5 flex items-center justify-center gap-6">
                <button onClick={onPrev} className={controlBtnClass}>
                ⏮
                </button>
                <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                ▶
                </button>
                <button onClick={onNext} className={controlBtnClass}>
                ⏭
                </button>
            </div>
        </div>
      </div>

      {/* bottom controls */}
      
    </div>
  );
}

const controlBtnClass =
  "w-6 h-6 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center";
