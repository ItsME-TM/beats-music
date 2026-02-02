"use client";

import Image from "next/image";
import { AiFillPlayCircle } from "react-icons/ai";
import React from "react";

export type Release = {
  id: number;
  title: string;
  artist: string;
  image: string;
};

type SongReleasesProps = {
  releases: Release[];
  onSelect?: (release: Release) => void;
  className?: string;
  title?: string;
};

export default function SongReleases({
  releases,
  onSelect,
  className = "",
  title = "US/UK Song New Releases",
}: SongReleasesProps) {
  return (
    <section className={`mt-2 bg-[#0b0b0b] rounded-xl px-3 sm:px-6 md:px-8 py-2 text-white ${className}`}>
      <div className="flex items-center mb-2">
        <h2 className="text-xs sm:text-sm font-semibold flex-1 truncate">{title}</h2>
        <button
          type="button"
          className="ml-2 sm:ml-3 mr-2 sm:mr-7 text-[10px] sm:text-xs font-medium text-[#00eaff] hover:underline whitespace-nowrap"
        >
          See more
        </button>
      </div>

      <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-1 -mx-1 px-1">
        {releases.map((r) => (
          <div
            key={r.id}
            className="flex flex-col items-center w-16 sm:w-20 flex-shrink-0 group cursor-pointer"
            onClick={() => onSelect?.(r)}
          >
            <div className="relative mb-1 sm:mb-2">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-orange-500 via-pink-500 to-red-500">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-black relative">
                  <Image
                    src={r.image}
                    alt={r.title}
                    fill
                    sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    aria-label={`Play ${r.title}`}
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/40 transition-opacity"
                  >
                    <AiFillPlayCircle className="text-white/90 drop-shadow cursor-pointer" size={28} />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[8px] sm:text-[9px] font-semibold text-center leading-tight line-clamp-2 w-full">
              {r.title}
            </p>
            <p className="text-[7px] sm:text-[8px] text-gray-400 line-clamp-1 text-center w-full">
              {r.artist}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
