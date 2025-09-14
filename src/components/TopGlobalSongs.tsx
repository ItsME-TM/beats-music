"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export type TopSong = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  image: string;
  isFavorite?: boolean;
};

type TopGlobalSongsProps = {
  songs: TopSong[];
  className?: string;
  initialVisible?: number; // number of rows visible before expand
  title?: string;
  onToggleFavorite?: (song: TopSong, next: boolean) => void;
  onSelect?: (song: TopSong) => void;
};

export default function TopGlobalSongs({
  songs,
  className = "",
  initialVisible = 6,
  title = "Top 100 Global Songs",
  onToggleFavorite,
  onSelect,
}: TopGlobalSongsProps) {
  const [tab, setTab] = useState<"new" | "global">("new");
  const [expanded, setExpanded] = useState(false);
  const [favorites, setFavorites] = useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {};
    songs.forEach((s) => {
      if (s.isFavorite) map[s.id] = true;
    });
    return map;
  });

  const visibleSongs = useMemo(
    () => (expanded ? songs : songs.slice(0, initialVisible)),
    [expanded, songs, initialVisible]
  );

  function toggleFavorite(song: TopSong) {
    setFavorites((prev) => {
      const next = { ...prev, [song.id]: !prev[song.id] };
      onToggleFavorite?.(song, !!next[song.id]);
      return next;
    });
  }

  return (
    <section
      className={`z-50 bg-[#0b0b0b] rounded-xl px-4 pt-0 pb-3 text-white ${className}`}
    >
      <div className="flex items-start gap-3">
        <h2 className="text-base font-semibold flex-1 leading-tight">
          {title}
        </h2>
        <div className="flex items-center gap-2 text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setTab("new")}
            className={`px-2 py-1 rounded-md border text-xs transition-colors ${
              tab === "new"
                ? "bg-[#00eaff] text-black border-transparent"
                : "bg-transparent border-[#222] text-gray-300 hover:text-white"
            }`}
          >
            New
          </button>
          <button
            type="button"
            onClick={() => setTab("global")}
            className={`px-2 py-1 rounded-md border text-xs transition-colors ${
              tab === "global"
                ? "bg-[#222] text-white border-transparent"
                : "bg-transparent border-[#222] text-gray-300 hover:text-white"
            }`}
          >
            Global
          </button>
        </div>
      </div>

      <div className="mt-3 divide-y divide-[#151515]">
        {visibleSongs.map((song, idx) => {
          const rank = idx + 1;
          const fav = !!favorites[song.id];
          return (
            <div
              key={song.id}
              className="flex items-center gap-3 py-2 group cursor-pointer"
              onClick={() => onSelect?.(song)}
            >
              <span className="w-5 text-xs text-gray-300 group-hover:text-[#00eaff]">
                {rank}
              </span>
              <div className="relative w-8 h-8 rounded-md overflow-hidden bg-[#222]">
                <Image
                  src={song.image}
                  alt={song.title}
                  fill
                  sizes="40px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate group-hover:text-[#00eaff]">
                  {song.title}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {song.artist}
                </p>
              </div>
              <span className="text-[11px] text-gray-400 w-10 text-right">
                {song.duration}
              </span>
              <button
                type="button"
                aria-label={fav ? "Unfavorite" : "Favorite"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(song);
                }}
                className="text-lg px-1 text-gray-300 hover:text-[#00eaff] transition-colors"
              >
                {fav ? (
                  <AiFillHeart className="text-[#00eaff]" />
                ) : (
                  <AiOutlineHeart />
                )}
              </button>
              <button
                type="button"
                aria-label="Menu"
                onClick={(e) => e.stopPropagation()}
                className="text-lg px-1 text-gray-300 hover:text-white"
              >
                <BsThreeDots />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-center">
        {songs.length > initialVisible && (
          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-1 text-[11px] text-gray-300 hover:text-white"
            aria-expanded={expanded}
          >
            {expanded ? "Collapse" : "Expand"}{" "}
            {expanded ? <IoChevronUp /> : <IoChevronDown />}
          </button>
        )}
      </div>
    </section>
  );
}
