"use client";
import React from "react";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // hearts
import { BsThreeDots } from "react-icons/bs"; // menu
import { IoPause } from "react-icons/io5"; // pause indicator

type Song = {
  id: number;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  image: string;
  isPlaying?: boolean;
  isFavorite?: boolean;
};

type RecentPlayedProps = {
  songs: Song[];
};

export default function RecentPlayed({ songs }: RecentPlayedProps) {
  return (
    <div className="bg-[#111] rounded-xl py-2 px-3 sm:px-4 md:px-6 text-white w-full">
      {/* Header */}
      <div className="flex items-center mb-2">
        <span className="text-sm sm:text-md font-semibold">Recently Played</span>
        <button
          className="ml-3 cursor-pointer text-[#00eaff] text-lg sm:text-xl hover:opacity-80 focus:outline-none"
          aria-label="Pause"
          type="button"
        >
          <IoPause />
        </button>
      </div>

      {/* Songs list */}
      <div className="space-y-1">
        {songs.map((song, idx) => {
          const active = song.isPlaying
            ? "bg-[#181818] py-2 text-[#00eaff]"
            : "text-white";

          return (
            <div
              key={song.id}
              className={`flex items-center gap-2 sm:gap-3 rounded-lg transition-colors ${active} py-1.5 sm:py-2`}
            >
              <div className="relative w-5 sm:w-6 h-5 sm:h-6 flex items-center justify-center text-[10px] sm:text-xs shrink-0">
                <span
                  className={`transition-opacity duration-150 ${
                    song.isPlaying ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {idx + 1}
                </span>
                {song.isPlaying && (
                  <IoPause
                    className="absolute inset-0 m-auto text-[#00eaff] text-xs sm:text-sm"
                    aria-label="Playing"
                  />
                )}
              </div>
              <Image
                src={song.image}
                alt={song.title}
                width={30}
                height={30}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg object-cover bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div
                  className={`${
                    song.isPlaying ? "font-semibold" : "font-normal"
                  } text-[11px] sm:text-xs truncate`}
                >
                  {song.title}
                </div>
                <div
                  className={`text-[10px] sm:text-xs truncate ${
                    song.isPlaying ? "text-[#00eaff]" : "text-gray-400"
                  }`}
                >
                  {song.artist}
                </div>
              </div>
              {/* Album - hidden on mobile */}
              <div className="hidden sm:block w-[100px] md:w-[120px] text-left text-[10px] sm:text-xs truncate text-gray-400">
                {song.album || "Album"}
              </div>
              <div className="w-10 sm:w-[60px] text-center text-[10px] sm:text-xs text-gray-400">
                {song.duration}
              </div>
              <button
                className={`p-1 sm:p-2 text-base sm:text-xl hover:scale-110 transition-transform focus:outline-none ${
                  song.isFavorite ? "text-[#00eaff]" : "text-white"
                }`}
                aria-label={song.isFavorite ? "Unfavorite" : "Favorite"}
                type="button"
              >
                {song.isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
              <button
                className="p-1 sm:p-2 text-base sm:text-xl text-white hover:scale-110 transition-transform focus:outline-none"
                aria-label="Menu"
                type="button"
              >
                <BsThreeDots />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
