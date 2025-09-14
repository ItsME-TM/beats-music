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
    <div className="bg-[#111] rounded-xl py-1 px-6 text-white w-160">
      {/* Header */}
      <div className="flex items-center mb-1">
        <span className="text-md font-semibold">Recently Played</span>
        <button
          className="ml-3 cursor-pointer text-[#00eaff] text-xl hover:opacity-80 focus:outline-none"
          aria-label="Pause"
          type="button"
        >
          <IoPause />
        </button>
      </div>

      {/* Songs list */}
      <div>
        {songs.map((song, idx) => {
          const active = song.isPlaying
            ? "bg-[#181818] py-2 text-[#00eaff]"
            : "text-white";

          return (
            <div
              key={song.id}
              className={`flex items-center mb-1 rounded-lg transition-colors ${active}`}
            >
              <div className="relative w-6 h-6 flex items-center justify-center text-xs mr-0">
                <span
                  className={`transition-opacity duration-150 ${
                    song.isPlaying ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {idx + 1}
                </span>
                {song.isPlaying && (
                  <IoPause
                    className="absolute inset-0 m-auto text-[#00eaff] text-sm"
                    aria-label="Playing"
                  />
                )}
              </div>
              <Image
                src={song.image}
                alt={song.title}
                width={30}
                height={30}
                className="rounded-lg mr-4 object-cover bg-white"
              />
              <div className="flex-1">
                <div
                  className={`${
                    song.isPlaying ? "font-semibold" : "font-normal"
                  } text-base text-xs`}
                >
                  {song.title}
                </div>
                <div
                  className={`text-xs ${
                    song.isPlaying ? "text-[#00eaff]" : "text-gray-400"
                  }`}
                >
                  {song.artist}
                </div>
              </div>
              <div className="w-[120px] text-left text-xs truncate">
                {song.album || "Album"}
              </div>
              <div className="w-[60px] text-center text-xs">
                {song.duration}
              </div>
              <button
                className={`ml-3 text-xl hover:scale-110 transition-transform focus:outline-none ${
                  song.isFavorite ? "text-[#00eaff]" : "text-white"
                }`}
                aria-label={song.isFavorite ? "Unfavorite" : "Favorite"}
                type="button"
              >
                {song.isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
              <button
                className="ml-3 text-xl text-white hover:scale-110 transition-transform focus:outline-none"
                aria-label="Menu"
                type="button"
              >
                <BsThreeDots />
              </button>
              {/* trailing playing icon removed; now overlaid on index */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
