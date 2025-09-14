"use client";

import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IoHome } from "react-icons/io5";
import { BsGraphUp } from "react-icons/bs";

export type Playlist = {
  id: number;
  name: string;
  description?: string;
};

type YourPlayListsProps = {
  playlists: Playlist[];
  onSelect?: (pl: Playlist) => void;
  onAdd?: () => void;
  className?: string;
  initialActiveId?: number;
  title?: string;
};

export default function YourPlayLists({
  playlists,
  onSelect,
  onAdd,
  className = "",
  initialActiveId,
  title = "Your PlayLists",
}: YourPlayListsProps) {
  const [activeId, setActiveId] = useState<number | undefined>(initialActiveId);

  function handleSelect(pl: Playlist) {
    setActiveId(pl.id);
    onSelect?.(pl);
  }

  return (
    <section
      className={`bg-[#0b0b0b] rounded-xl px-4 py-1 text-white ${className}`}
    >
      <div className="flex items-center mb-1 gap-2">
        <IoHome className="text-lg" />
        <h2 className="text-base font-semibold flex-1 leading-tight">
          {title}
        </h2>
        <button
          type="button"
          onClick={() => onAdd?.()}
          aria-label="Add playlist"
          className="p-1 text-xl text-gray-300 hover:text-[#00eaff] transition-colors"
        >
          <AiOutlinePlus />
        </button>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        {playlists.map((pl) => {
          const active = pl.id === activeId;
          return (
            <button
              key={pl.id}
              type="button"
              onClick={() => handleSelect(pl)}
              className={`group flex items-center text-left rounded-md px-2 py-1 transition-colors focus:outline-none focus:ring-1 focus:ring-[#00eaff] ${
                active
                  ? "bg-[#181818] text-[#ff4d4d] font-medium"
                  : "text-gray-300 hover:text-white hover:bg-[#141414]"
              }`}
              aria-pressed={active}
            >
              <span className="flex items-center gap-3 flex-1 min-w-0">
                <span className="truncate">{pl.name}</span>
                {active && (
                  <BsGraphUp className="text-[#ff4d4d] text-sm shrink-0" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
