"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import AddPlaylistButton from "./AddPlaylistButton";

type LyricLine = {
  time: number;
  text: string;
};

type SongPlayerProps = {
  title: string;
  artists: string[];
  coverUrl?: string;
  audioSrc?: string;
  lyrics?: LyricLine[];
  duration?: number;
  onAddToPlaylist?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function SongPlayer({
  title,
  artists,
  coverUrl,
  audioSrc,
  lyrics = [],
  duration: durationProp,
  onAddToPlaylist,
  onPrev,
  onNext,
}: SongPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<"off" | "one">("off");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(
    durationProp || inferDuration(lyrics) || 200
  );

  const progressPct = Math.min(100, (currentTime / Math.max(duration, 1)) * 100);

  // --- audio setup ---
  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    const onLoaded = () =>
      setDuration(Math.max(durationProp || audio.duration || 0, 1));
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnd = () => {
      if (repeat === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
        onNext?.();
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
  }, [audioSrc, repeat]);

  // --- simulation for when no audioSrc ---
  useEffect(() => {
    if (audioSrc) return;
    if (!isPlaying) return;

    const start = Date.now();
    const startTime = currentTime;
    const id = window.setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const t = startTime + elapsed;
      if (t >= duration) {
        if (repeat === "one") {
          setCurrentTime(0);
        } else {
          setIsPlaying(false);
        }
        window.clearInterval(id);
      } else {
        setCurrentTime(t);
      }
    }, 250);

    return () => window.clearInterval(id);
  }, [isPlaying, duration, currentTime, repeat, audioSrc]);

  // --- lyrics highlighting ---
  const currentLyricIndex = useMemo(() => {
    if (!lyrics.length) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= currentTime) idx = i;
      else break;
    }
    return idx;
  }, [lyrics, currentTime]);

  const visibleLyrics = useMemo(() => {
    if (!lyrics.length) return [];
    const start = Math.max(0, currentLyricIndex - 2);
    const end = Math.min(lyrics.length, currentLyricIndex + 4);
    return lyrics.slice(start, end).map((l, i) => ({
      ...l,
      isCurrent: l.time === lyrics[currentLyricIndex]?.time,
      key: `${l.time}-${i}`,
    }));
  }, [lyrics, currentLyricIndex]);

  // --- handlers ---
  function togglePlayPause() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
    setIsPlaying((p) => !p);
  }

  function seekTo(t: number) {
    const clamped = Math.max(0, Math.min(duration, t));
    setCurrentTime(clamped);
    if (audioRef.current) audioRef.current.currentTime = clamped;
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

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
      <div className="relative flex gap-2 h-full p-6">
        {/* left: song info */}
        <div className="w-60 self-center">
          <p className="text-xs font-bold opacity-80 mb-2">FEATURED SONG</p>
          <h1 className="text-xl font-extrabold leading-tight">{title}</h1>
          <p className="mt-2 text-xs opacity-90">{artists.join(" & ")}</p>

          <div className="flex items-center gap-4 mt-4">
            <button
              aria-label="Like"
              className="p-2"
              onClick={() => setLiked((l) => !l)}
            >
              {liked ? "❤️" : "🤍"}
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
        <div className="ml-5 mt-5 flex-1 self-center">
          {visibleLyrics.length ? (
            <div className="flex flex-col ml-6 gap-2">
              {visibleLyrics.map((l) => (
                <div
                  key={l.key}
                  className={`text-lg ${
                    l.isCurrent
                      ? "font-bold text-red-400"
                      : "opacity-80 text-white"
                  }`}
                >
                  {l.text}
                </div>
              ))}
            </div>
          ) : (
            <p className="opacity-70 text-sm">No lyrics available.</p>
          )}

          {/* controls under lyrics */}
          <div className="mt-5 flex flex-col gap-3">
            {/* progress */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 text-xs opacity-80">
                {formatTime(currentTime)}
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(duration, 1)}
                step={0.1}
                value={Math.min(currentTime, duration)}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="flex-1 appearance-none h-[6px] rounded-full outline-none"
                style={{
                  background: `linear-gradient(to right, #ff4b4b ${progressPct}%, rgba(255,255,255,0.35) ${progressPct}%)`,
                }}
              />
              <div className="w-10 text-right text-xs opacity-80">
                {formatTime(duration)}
              </div>
            </div>

            {/* play controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setShuffle((s) => !s)}
                className={controlBtnClass}
              >
                🔀
              </button>
              <button onClick={onPrev} className={controlBtnClass}>
                ⏮
              </button>
              <button
                onClick={togglePlayPause}
                className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center"
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button onClick={onNext} className={controlBtnClass}>
                ⏭
              </button>
              <button
                onClick={() => setRepeat((r) => (r === "off" ? "one" : "off"))}
                className={controlBtnClass}
              >
                🔁
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function inferDuration(lyrics: LyricLine[]) {
  if (!lyrics.length) return undefined;
  return Math.ceil(lyrics[lyrics.length - 1].time + 1);
}

const controlBtnClass =
  "w-6 h-6 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center";
