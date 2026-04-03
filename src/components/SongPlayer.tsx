"use client";

import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Image from "next/image";

import ReactPlayer from "react-player";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayerAny: any = ReactPlayer;
import NoSleep from "nosleep.js";
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
  autoplayRequestAt?: number;
  lyrics?: LyricLine[];
  duration?: number;
  onAddToPlaylist?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onShuffleChange?: (shuffle: boolean) => void;
};

export default function SongPlayer({
  title,
  artists,
  coverUrl,
  audioSrc,
  youtubeVideoId,
  autoplayRequestAt,
  lyrics = [],
  duration: durationProp,
  onAddToPlaylist,
  onPrev,
  onNext,
  onShuffleChange,
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
  const [repeat, setRepeat] = useState<"off" | "all" | "one">("off");
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const isSeekingRef = useRef(false);
  const [seekPreviewTime, setSeekPreviewTime] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const noSleepRef = useRef<any>(null);

  const [playerReady, setPlayerReady] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    try {
      noSleepRef.current = new NoSleep();
    } catch (err) {
      console.warn("[SongPlayer] NoSleep init failed:", err);
    }
    return () => {
      try {
        noSleepRef.current?.disable();
      } catch {}
    };
  }, []);

  // react-player v3 ref callback — the ref points to the underlying
  // custom element (e.g. <youtube-video-element>) which extends HTMLVideoElement
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePlayerRef = useCallback((node: any) => {
    playerRef.current = node;
    console.log("[SongPlayer] 🔍 ReactPlayer v3 ref callback:", {
      node: !!node,
      tagName: node?.tagName,
      hasCurrentTime: "currentTime" in (node || {}),
      hasDuration: "duration" in (node || {}),
      hasPlay: typeof node?.play,
      hasPause: typeof node?.pause,
    });
  }, []);

  // Reset player state when audioSrc or youtubeVideoId changes
  useEffect(() => {
    console.log("[SongPlayer] media source changed ->", {
      audioSrc,
      youtubeVideoId,
    });
    if (audioSrc || youtubeVideoId) {
      setCurrentTime(0);
      setPlayerReady(false);
    }
  }, [audioSrc, youtubeVideoId]);

  // Auto-play ONLY if user has already interacted with the player before
  useEffect(() => {
    const hasSource = !!(audioSrc || youtubeVideoId);
    if (playerReady && hasSource && hasUserInteracted) {
      console.log("[SongPlayer] auto-play allowed, starting playback");
      setIsPlaying(true);
      // In v3, control via the ref's native .play() method
      try {
        try {
          noSleepRef.current?.enable();
        } catch (err) {
          console.warn("[SongPlayer] NoSleep enable failed:", err);
        }
        playerRef.current?.play();
      } catch (err) {
        console.error("[SongPlayer] auto-play via ref failed:", err);
      }
    } else if (playerReady && hasSource && !hasUserInteracted) {
      console.log(
        "[SongPlayer] player ready but waiting for user interaction to play",
      );
    }
  }, [playerReady, audioSrc, youtubeVideoId, hasUserInteracted]);

  // If the parent signals a recent user-initiated selection, consider that
  // as an interaction so autoplay can proceed once the media is ready.
  useEffect(() => {
    if (autoplayRequestAt) {
      console.log(
        "[SongPlayer] autoplay requested by parent/user at",
        autoplayRequestAt,
      );
      setHasUserInteracted(true);
    }
  }, [autoplayRequestAt]);

  useEffect(() => {
    if (durationProp) setDuration(durationProp);
  }, [durationProp]);

  // Sync volume to the player element when it changes
  useEffect(() => {
    console.log("[SongPlayer] volume changed ->", volume);
    if (playerRef.current) {
      try {
        playerRef.current.volume = volume;
      } catch {
        /* ignore */
      }
    }
  }, [volume]);

  // Setup Media Session API for background playback and lockscreen controls
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: title || "Unknown Track",
        artist: artists?.join(", ") || "Unknown Artist",
        album: "Beats Music",
        artwork: coverUrl
          ? [{ src: coverUrl, sizes: "512x512", type: "image/png" }]
          : [],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        setHasUserInteracted(true);
        setIsPlaying(true);
        try {
          noSleepRef.current?.enable();
        } catch (err) {
          console.warn("[SongPlayer] NoSleep enable failed:", err);
        }
        playerRef.current?.play();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        setIsPlaying(false);
        try {
          noSleepRef.current?.disable();
        } catch {}
        playerRef.current?.pause();
      });
      navigator.mediaSession.setActionHandler(
        "previoustrack",
        onPrev ? () => onPrev() : null,
      );
      navigator.mediaSession.setActionHandler(
        "nexttrack",
        onNext ? () => onNext() : null,
      );
    }
  }, [title, artists, coverUrl, onPrev, onNext]);

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
      hasRef: !!playerRef.current,
    });
    setHasUserInteracted(true);
    setIsPlaying(next);

    // In react-player v3, control playback via the underlying element
    if (playerRef.current) {
      try {
        if (next) {
          try {
            noSleepRef.current?.enable();
          } catch (err) {
            console.warn("[SongPlayer] NoSleep enable failed:", err);
          }
          playerRef.current.play();
        } else {
          try {
            noSleepRef.current?.disable();
          } catch {}
          playerRef.current.pause();
        }
      } catch (err) {
        console.error("[SongPlayer] play/pause via ref failed:", err);
      }
    }
  }

  // Seek using native HTMLMediaElement API (currentTime property)
  function seekTo(t: number) {
    const numeric = Number.isFinite(t) ? t : 0;
    const clamped = Math.max(0, Math.min(duration || 0, numeric));
    console.log("[SongPlayer] 🎯 SEEKTO CALLED:", {
      input: t,
      numeric,
      clamped,
      duration,
      playerRef: !!playerRef.current,
      tagName: playerRef.current?.tagName,
    });

    setCurrentTime(clamped);
    setSeekPreviewTime(null);

    if (!playerRef.current) {
      console.error(
        "[SongPlayer] ❌ Cannot seek - playerRef.current is null/undefined",
      );
      isSeekingRef.current = false;
      return;
    }

    // react-player v3: Seek via the native .currentTime property
    try {
      console.log("[SongPlayer] 🎯 Setting currentTime to:", clamped);
      playerRef.current.currentTime = clamped;
      console.log(
        "[SongPlayer] ✅ seek successful, currentTime is now:",
        playerRef.current.currentTime,
      );
    } catch (err) {
      console.error("[SongPlayer] ❌ seek failed:", err);
    }

    // NOTE: isSeekingRef is reset by the caller (onMouseUp/onTouchEnd)
  }

  function handleSeekPreview(next: number) {
    const value = Number.isFinite(next) ? next : 0;
    setSeekPreviewTime(value);
  }

  function changeVolume(val: number) {
    const v = Math.max(0, Math.min(1, val));
    setVolume(v);
  }

  const [liked, setLiked] = useState(false);
  const prevVolumeRef = useRef(0.8);

  function toggleMute() {
    if (volume > 0) {
      prevVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(prevVolumeRef.current);
    }
  }

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

  // ---- react-player v3 event handlers (HTML5 media events) ----

  // onReady is handled specially by react-player v3 (fires on loadstart)
  const handleReady = useCallback(() => {
    console.log("[SongPlayer] 🎵 ReactPlayer v3 READY (loadstart)", {
      mediaSrc,
      hasRef: !!playerRef.current,
      tagName: playerRef.current?.tagName,
    });
    setPlayerReady(true);
  }, [mediaSrc]);

  // onDurationChange: standard HTML5 media event, fires when duration is available
  const handleDurationChange = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const el = e.currentTarget;
      const dur = el.duration;
      console.log("[SongPlayer] 🎵 durationchange:", {
        duration: dur,
        isFinite: Number.isFinite(dur),
        currentDuration: duration,
      });
      if (Number.isFinite(dur) && dur > 0) {
        setDuration(dur);
      }
    },
    [duration],
  );

  // onTimeUpdate: standard HTML5 media event, fires as playback advances
  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (isSeekingRef.current) return;
      const el = e.currentTarget;
      const secs = el.currentTime;
      if (Number.isFinite(secs) && secs >= 0) {
        setCurrentTime(secs);
      }
    },
    [],
  );

  // onPlay: standard HTML5 media event
  const handlePlay = useCallback(() => {
    console.log("[SongPlayer] 🎵 onPlay fired");
    setIsPlaying(true);
    setHasUserInteracted(true);
  }, []);

  // onPause: standard HTML5 media event
  const handlePause = useCallback(() => {
    console.log("[SongPlayer] 🎵 onPause fired");
    // Only update if we're not in the middle of a seek
    if (!isSeekingRef.current) {
      setIsPlaying(false);
    }
  }, []);

  // onEnded: standard HTML5 media event
  const handleEnded = useCallback(() => {
    console.log("[SongPlayer] 🎵 onEnded fired, repeat:", repeat);
    if (repeat === "one") {
      // Restart the same track
      if (playerRef.current) {
        playerRef.current.currentTime = 0;
        playerRef.current.play();
      }
    } else if (repeat === "all") {
      if (onNext) onNext();
    } else {
      if (onNext) onNext();
      else setIsPlaying(false);
    }
  }, [repeat, onNext]);

  // onError: standard HTML5 media event
  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      console.error("[SongPlayer] ❌ Playback error:", e);
      setIsPlaying(false);
    },
    [],
  );

  return (
    <div
      className={`relative rounded-3xl text-white shadow-2xl overflow-hidden ${
        coverUrl
          ? "bg-center bg-cover"
          : "bg-linear-to-br from-[#0b0f14] to-[#131a21]"
      } w-full h-auto min-h-80 sm:min-h-90 md:min-h-[40vh] lg:min-h-[80vh] transition-all duration-700 ease-in-out border-2 border-cyan-400`}
      style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
    >
      {/* Hidden media player: react-player v3 renders a custom element (e.g. youtube-video-element) */}
      {mediaSrc && (
        <div
          className="absolute left-0 top-0 w-0 h-0"
          style={{ visibility: "hidden", pointerEvents: "none" }}
        >
          <div
            style={{
              width: 480,
              height: 270,
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            <ReactPlayerAny
              ref={handlePlayerRef}
              src={mediaSrc}
              autoPlay={false}
              volume={volume}
              muted={false}
              loop={repeat === "one"}
              playsInline
              onReady={handleReady}
              onDurationChange={handleDurationChange}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onError={handleError}
              width="480"
              height="270"
              config={{
                youtube: {
                  playerVars: {
                    origin:
                      typeof window !== "undefined"
                        ? window.location.origin
                        : "",
                  },
                },
                file: {
                  forceAudio: true,
                },
              }}
            />
          </div>
        </div>
      )}

      {/* glass overlay */}
      <div className="absolute inset-0 bg-linear-to-l from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0.7)] backdrop-blur-[2px]" />

      {/* content */}
      <div className="relative flex flex-col md:flex-row gap-6 h-full p-6 md:p-8">
        {/* left: song info + thumbnail/video */}
        <div className="relative w-full md:w-50 self-start md:self-stretch shrink-0 md:flex md:flex-col">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden mb-4 shadow-lg">
            {coverUrl ? (
              <Image src={coverUrl} alt={title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-cyan-900 to-gray-900 flex items-center justify-center">
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
          <h1 className="text-xl sm:text-xl md:text-xl font-extrabold leading-tight drop-shadow-lg line-clamp-2">
            {title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm md:text-base opacity-75 font-medium text-cyan-50">
            {artists.join(" & ")}
          </p>

          <div className="mt-6 flex items-center gap-4 lg:absolute lg:left-0 lg:top-90">
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
        <div className="flex-1 flex flex-col justify-between py-2 relative">
          {/* Lyrics section */}
          <div className="hidden flex-1 overflow-hidden md:flex flex-col items-center justify-center mask-fade">
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
          <div className="mt-6 flex flex-col gap-5 px-2 lg:pb-10">
            {/* progress / seek bar */}
            <div className="group/progress relative pt-2">
              <input
                type="range"
                min={0}
                max={Math.max(duration, 1)}
                step={0.1}
                value={seekPreviewTime ?? currentTime}
                disabled={!mediaSrc || !playerReady}
                onInput={(e) => {
                  const newTime = Number((e.target as HTMLInputElement).value);
                  if (!isSeekingRef.current) {
                    isSeekingRef.current = true;
                  }
                  handleSeekPreview(newTime);
                }}
                onChange={(e) => {
                  // In React, onChange fires on every value change (same as onInput).
                  // We only use this to update the preview — actual seek happens on mouse/touch up.
                  const newTime = Number(e.target.value);
                  handleSeekPreview(newTime);
                }}
                onMouseDown={() => {
                  console.log("[SongPlayer] 🎯 SEEK MOUSEDOWN - Starting seek");
                  isSeekingRef.current = true;
                }}
                onTouchStart={() => {
                  console.log(
                    "[SongPlayer] 🎯 SEEK TOUCHSTART - Starting seek (touch)",
                  );
                  isSeekingRef.current = true;
                }}
                onMouseUp={(e) => {
                  const newTime = Number((e.target as HTMLInputElement).value);
                  console.log(
                    "[SongPlayer] 🎯 SEEK MOUSEUP - Committing seek:",
                    {
                      newTime,
                      duration,
                      playerRef: !!playerRef.current,
                    },
                  );
                  seekTo(newTime);
                  setTimeout(() => {
                    isSeekingRef.current = false;
                    console.log(
                      "[SongPlayer] 🎯 Seek complete, resuming progress tracking",
                    );
                  }, 250);
                }}
                onTouchEnd={(e) => {
                  const newTime = Number((e.target as HTMLInputElement).value);
                  console.log(
                    "[SongPlayer] 🎯 SEEK TOUCHEND - Committing seek:",
                    {
                      newTime,
                      duration,
                    },
                  );
                  seekTo(newTime);
                  setTimeout(() => {
                    isSeekingRef.current = false;
                    console.log(
                      "[SongPlayer] 🎯 Touch seek complete, resuming progress tracking",
                    );
                  }, 250);
                }}
                className="w-full appearance-none h-1.5 rounded-full outline-none cursor-pointer group-hover/progress:h-2 transition-all bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="flex items-center justify-between w-full min-w-0 px-2 md:px-0 lg:absolute lg:top-93 lg:left-5 lg:w-full">
              <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-4 lg:space-x-6 min-w-0">
                <button
                  onClick={() =>
                    setShuffle((s) => {
                      const next = !s;
                      onShuffleChange?.(next);
                      return next;
                    })
                  }
                  className={`transition-all ${shuffle ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-white/60 hover:text-white"}`}
                  aria-label="Shuffle"
                >
                  <IoShuffle size={20} />
                </button>
                <button
                  onClick={onPrev}
                  disabled={!onPrev}
                  className="text-white/80 hover:text-white transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white/80"
                  aria-label="Previous"
                >
                  <IoPlaySkipBack size={20} />
                </button>
                <button
                  onClick={togglePlayPause}
                  disabled={!mediaSrc}
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:mr-6 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                  disabled={!onNext}
                  className="text-white/80 hover:text-white transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-white/80"
                  aria-label="Next"
                >
                  <IoPlaySkipForward size={20} />
                </button>
                <button
                  onClick={() =>
                    setRepeat((r) =>
                      r === "off" ? "all" : r === "all" ? "one" : "off",
                    )
                  }
                  className={`relative transition-all ${repeat !== "off" ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-white/60 hover:text-white"}`}
                  aria-label="Repeat"
                >
                  <IoRepeat size={20} />
                  {repeat === "one" && (
                    <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold bg-cyan-400 text-black rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                      1
                    </span>
                  )}
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2 ml-2 lg:ml-8 group/volume shrink-0">
                <button
                  onClick={toggleMute}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label={volume === 0 ? "Unmute" : "Mute"}
                >
                  <VolumeIcon />
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => changeVolume(Number(e.target.value))}
                  className="hidden lg:block w-20 xl:w-24 accent-cyan-400 h-1 cursor-pointer"
                />
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
