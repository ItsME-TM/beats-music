"use client";

import React from "react";

type AddPlaylistButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  width?: string;
  height?: string;
  text?: string;
};

export default function AddPlaylistButton({
  onClick,
  disabled,
  width,
  text,
  height,
}: AddPlaylistButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Add to Playlist"
      className={`bg-teal-500 font-inter text-xs px-1 hover:text-white cursor-pointer  font-bold color-[#17DCF5] text-black ${
        width ?? ""
      } ${height ?? ""}   `}
    >
      {text}
    </button>
  );
}
