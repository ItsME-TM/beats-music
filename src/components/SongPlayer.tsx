"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";

import ReactPlayer from "react-player";
import AddPlaylistButton from "./AddPlaylistButton";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {
  IoPlay,
  IoPause,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoShuffle,
  IoRepeat,
  IoVolumeHigh,
  IoVolumeMedium,
  IoVolumeLow,
  IoVolumeMute,
} from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";

type LyricLine = {
  time: number;
  text: string;
};

type SongPlayerProps = {
  title: string;
  artists: string[];
  coverUrl?: string;
  audioSrc?: string;
  youtubeVideoId?: string;
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
  youtubeVideoId,
  lyrics = [],
  duration: durationProp,
  onAddToPlaylist,
  onPrev,
  onNext,
}: SongPlayerProps) {
  console.log("[SongPlayer] init props:", {
    title,
    artists,
    coverUrl,
    audioSrc,
    durationProp,
    youtubeVideoId,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(durationProp || 0);
  const [repeat, setRepeat] = useState<"off" | "one">("off");
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPreviewTime, setSeekPreviewTime] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Reset player state when audioSrc or youtubeVideoId changes
  useEffect(() => {
    console.log("[SongPlayer] media source changed ->", {
      audioSrc,
      youtubeVideoId,
    });
    if (audioSrc || youtubeVideoId) {
      setCurrentTime(0);
      setPlayerReady(false);
      // Don't auto-play - browser blocks it without user interaction
      // User must click play button (togglePlayPause) to start playback
    }
  }, [audioSrc, youtubeVideoId]);

  // Auto-play ONLY if user has already interacted with the player before
  useEffect(() => {
    const hasSource = !!(audioSrc || youtubeVideoId);
    if (playerReady && hasSource && hasUserInteracted) {
      console.log("[SongPlayer] auto-play allowed, starting playback");
      setIsPlaying(true);
    } else if (playerReady && hasSource && !hasUserInteracted) {
      console.log(
        "[SongPlayer] player ready but waiting for user interaction to play",
      );
    }
  }, [playerReady, audioSrc, youtubeVideoId, hasUserInteracted]);

  useEffect(() => {
    if (durationProp) setDuration(durationProp);
  }, [durationProp]);

  const effectiveCurrentTime = seekPreviewTime ?? currentTime;
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 1;
  const progressPct = Math.min(
    100,
    (effectiveCurrentTime / safeDuration) * 100,
  );

  function togglePlayPause() {
    const next = !isPlaying;
    console.log("[SongPlayer] user toggled play/pause ->", {
      wasPlaying: isPlaying,
      next,
    });
    setHasUserInteracted(true);
    setIsPlaying(next);

    // For YouTube, also invoke the internal IFrame API directly in the user gesture.
    if (youtubeVideoId && next) {
      try {
        const internal = playerRef.current?.getInternalPlayer?.();
        if (internal) {
          if (typeof internal.unMute === "function") internal.unMute();
          if (typeof internal.setVolume === "function")
            internal.setVolume(Math.round(volume * 100));
          if (typeof internal.playVideo === "function") internal.playVideo();
          const state =
            typeof internal.getPlayerState === "function"
              ? internal.getPlayerState()
              : "unknown";
          console.log("[SongPlayer] forced youtube play via internal player", {
            hasInternal: !!internal,
            state,
          });
        } else {
          console.log("[SongPlayer] internal youtube player not ready yet");
        }
      } catch (err) {
        console.error("[SongPlayer] internal youtube play failed", err);
      }
    }
  }

  useEffect(() => {
    if (!youtubeVideoId) return;
    const t = window.setTimeout(() => {
      try {
        const internal = playerRef.current?.getInternalPlayer?.();
        const state =
          typeof internal?.getPlayerState === "function"
            ? internal.getPlayerState()
            : "unknown";
        const muted =
          typeof internal?.isMuted === "function"
            ? internal.isMuted()
            : "unknown";
        console.log("[SongPlayer] youtube internal state snapshot", {
          state,
          muted,
          isPlaying,
          currentTime,
        });
      } catch (err) {
        console.error("[SongPlayer] youtube state snapshot failed", err);
      }
    }, 1200);
    return () => window.clearTimeout(t);
  }, [youtubeVideoId, isPlaying, currentTime]);

  function seekTo(t: number) {
    const numeric = Number.isFinite(t) ? t : 0;
    const clamped = Math.max(0, Math.min(duration || 0, numeric));
    console.log("[SongPlayer] seekTo ->", clamped);
    setCurrentTime(clamped);
    setSeekPreviewTime(null);
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      try {
        playerRef.current.seekTo(clamped);
      } catch {
        const fraction = duration > 0 ? clamped / duration : 0;
        playerRef.current.seekTo(fraction, "fraction");
      }
    }
  }

  function handleSeekPreview(next: number) {
    const value = Number.isFinite(next) ? next : 0;
    setSeekPreviewTime(value);
    setCurrentTime(value);
  }

  function changeVolume(val: number) {
    const v = Math.max(0, Math.min(1, val));
    setVolume(v);
  }

  useEffect(() => {
    console.log("[SongPlayer] volume changed ->", volume);
    if (
      playerRef.current &&
      typeof playerRef.current.setVolume === "function"
    ) {
      try {
        playerRef.current.setVolume(volume);
      } catch (e) {
        // ignore
      }
    }
  }, [volume]);

  const [liked, setLiked] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

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
    const total = lyrics.length;
    if (!total) return [];
    const windowSize = Math.min(5, total);
    let start: number;
    if (currentLyricIndex < 0) {
      start = 0;
    } else {
      start = currentLyricIndex - Math.floor(windowSize / 2);
      start = Math.max(0, Math.min(start, total - windowSize));
    }
    const end = start + windowSize;
    return lyrics.slice(start, end).map((l, i) => ({
      ...l,
      isCurrent: l.time === lyrics[currentLyricIndex]?.time,
      key: `${l.time}-${i}`,
    }));
  }, [lyrics, currentLyricIndex]);

  function formatTime(s: number) {
    const safe = Number.isFinite(s) && s >= 0 ? s : 0;
    const m = Math.floor(safe / 60);
    const sec = Math.floor(safe % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  const VolumeIcon = () => {
    if (volume === 0) return <IoVolumeMute size={18} />;
    if (volume < 0.3) return <IoVolumeLow size={18} />;
    if (volume < 0.7) return <IoVolumeMedium size={18} />;
    return <IoVolumeHigh size={18} />;
  };

  const mediaSrc = youtubeVideoId
    ? `https://www.youtube.com/watch?v=${youtubeVideoId}`
    : audioSrc;

  return (
    <div
      className={`relative rounded-3xl text-white shadow-2xl overflow-hidden ${
        coverUrl
          ? "bg-center bg-cover"
          : "bg-gradient-to-br from-[#0b0f14] to-[#131a21]"
      } w-full h-[340px] sm:h-[380px] md:h-[440px] transition-all duration-700 ease-in-out border border-white/10`}
      style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
    >
      {/* Hidden media player: keeps playback running while UI shows thumbnail/artwork */}
      {mediaSrc && (
        <div
          className="absolute left-0 top-0 w-[1px] h-[1px] overflow-hidden"
          style={{ opacity: 0.01, pointerEvents: "none" }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <ReactPlayer
            ref={playerRef as any}
            src={mediaSrc}
            playing={isPlaying}
            volume={volume}
            muted={false}
            loop={repeat === "one"}
            onReady={() => {
              console.log("[SongPlayer] hidden Player ready ->", {
                mediaSrc,
                youtubeVideoId,
                playerRefCurrent: playerRef.current,
              });
              setPlayerReady(true);
            }}
            onError={(e: Error) => {
              console.error("[SongPlayer] hidden Playback error:", e);
              setIsPlaying(false);
            }}
            onPlay={() => {
              console.log("[SongPlayer] hidden Playback started");
              setIsPlaying(true);
              setHasUserInteracted(true);
            }}
            onPause={() => console.log("[SongPlayer] hidden Playback paused")}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onProgress={(prog: any) => {
              const secondsRaw = prog?.playedSeconds ?? prog?.played ?? 0;
              const seconds = Number(secondsRaw);
              if (!isSeeking && Number.isFinite(seconds)) {
                setCurrentTime(seconds);
              }
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onDuration={(dur: any) => {
              const parsed = Number(dur);
              if (Number.isFinite(parsed) && parsed > 0) {
                setDuration(parsed);
              }
            }}
            onEnded={() => {
              if (repeat === "one") {
                if (
                  playerRef.current &&
                  typeof playerRef.current.seekTo === "function"
                ) {
                  playerRef.current.seekTo(0);
                }
              } else {
                if (onNext) onNext();
                else setIsPlaying(false);
              }
            }}
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                  playsinline: 1,
                  origin:
                    typeof window !== "undefined" ? window.location.origin : "",
                },
              },
              file: {
                forceAudio: true,
                attributes: { crossOrigin: "anonymous" },
              },
            }}
          />
        </div>
      )}

      {/* glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-l from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0.7)] backdrop-blur-[2px]" />

      {/* content */}
      <div className="relative flex flex-col md:flex-row gap-6 h-full p-6 md:p-8">
        {/* left: song info + thumbnail/video */}
        <div className="md:w-64 self-start md:self-center">
          <div className="w-40 h-40 rounded-2xl overflow-hidden mb-4 shadow-lg">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-900 to-gray-900 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] opacity-80 uppercase">
              Now Streaming
            </p>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight drop-shadow-lg line-clamp-2">
            {title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm md:text-base opacity-75 font-medium text-cyan-50">
            {artists.join(" & ")}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <button
              aria-label="Like"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors shadow-inner"
              onClick={() => setLiked((l) => !l)}
            >
              {liked ? (
                <AiFillHeart className="text-red-500 scale-110" size={20} />
              ) : (
                <AiOutlineHeart className="opacity-80" size={20} />
              )}
            </button>
            <button className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white/80">
              <BsThreeDots size={20} />
            </button>
            <AddPlaylistButton
              text="Save To"
              width="w-24 sm:w-28"
              height="h-9 sm:h-10"
              onClick={onAddToPlaylist}
            />
          </div>
        </div>

        {/* right: lyrics & controls */}
        <div className="flex-1 flex flex-col justify-between py-2">
          {/* Lyrics section */}
          <div className="flex-1 overflow-hidden flex flex-col items-center justify-center mask-fade">
            {visibleLyrics.length ? (
              <div className="flex flex-col items-center gap-3 sm:gap-4 transition-all duration-500">
                {visibleLyrics.map((l) => (
                  <div
                    key={l.key}
                    className={`text-base sm:text-lg md:text-xl text-center select-none transition-all duration-500 translate-y-0 ${
                      l.isCurrent
                        ? "font-bold text-cyan-400 scale-110 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                        : "opacity-40 text-white blur-[0.5px] scale-95"
                    }`}
                  >
                    {l.text}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-40 gap-4">
                <span className="text-3xl animate-bounce">🎵</span>
                <p className="text-xs sm:text-sm italic tracking-widest uppercase">
                  Vibing to the rhythm...
                </p>
              </div>
            )}
          </div>

          {/* controls */}
          <div className="mt-6 flex flex-col gap-5 px-2">
            {/* progress */}
            <div className="group/progress relative pt-2">
              <input
                type="range"
                min={0}
                max={Math.max(duration, 1)}
                step={0.1}
                value={Math.min(effectiveCurrentTime, duration || 0)}
                onMouseDown={() => setIsSeeking(true)}
                onTouchStart={() => setIsSeeking(true)}
                onChange={(e) => handleSeekPreview(Number(e.target.value))}
                onMouseUp={(e) => {
                  setIsSeeking(false);
                  seekTo(Number((e.target as HTMLInputElement).value));
                }}
                onTouchEnd={(e) => {
                  setIsSeeking(false);
                  seekTo(Number((e.target as HTMLInputElement).value));
                }}
                className="w-full appearance-none h-1.5 rounded-full outline-none cursor-pointer group-hover/progress:h-2 transition-all bg-white/20"
                style={{
                  background: `linear-gradient(to right, #22d3ee ${progressPct}%, rgba(255,255,255,0.15) ${progressPct}%)`,
                }}
              />
              <div className="flex justify-between mt-2.5">
                <span className="text-[10px] sm:text-xs font-medium opacity-60 tabular-nums">
                  {formatTime(effectiveCurrentTime)}
                </span>
                <span className="text-[10px] sm:text-xs font-medium opacity-60 tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* main buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 sm:gap-6">
                <button
                  onClick={() => setShuffle((s) => !s)}
                  className={`transition-all ${shuffle ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-white/60 hover:text-white"}`}
                  aria-label="Shuffle"
                >
                  <IoShuffle size={20} />
                </button>
                <button
                  onClick={onPrev}
                  className="text-white/80 hover:text-white transition-all active:scale-90"
                  aria-label="Previous"
                >
                  <IoPlaySkipBack size={20} />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <IoPause size={28} />
                  ) : (
                    <IoPlay size={28} className="translate-x-0.5" />
                  )}
                </button>
                <button
                  onClick={onNext}
                  className="text-white/80 hover:text-white transition-all active:scale-90"
                  aria-label="Next"
                >
                  <IoPlaySkipForward size={20} />
                </button>
                <button
                  onClick={() =>
                    setRepeat((r) => (r === "off" ? "one" : "off"))
                  }
                  className={`transition-all ${repeat === "one" ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-white/60 hover:text-white"}`}
                  aria-label="Repeat"
                >
                  <IoRepeat size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3 group/volume relative">
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <VolumeIcon />
                </button>
                <div
                  className={`flex items-center transition-all duration-300 ${showVolume ? "w-20 sm:w-24 opacity-100" : "w-0 opacity-0 pointer-events-none"} overflow-hidden`}
                >
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mask-fade {
          mask-image: linear-gradient(
            to bottom,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
        }
      `}</style>
    </div>
  );
}
