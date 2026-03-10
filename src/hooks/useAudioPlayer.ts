import { useEffect, useRef, useState } from "react";

type UseAudioPlayerProps = {
  audioSrc?: string;
  durationProp?: number;
  onNext?: () => void;
};

export default function useAudioPlayer({
  audioSrc,
  durationProp,
  onNext,
}: UseAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const durationPropRef = useRef(durationProp);
  const volumeRef = useRef(0.8);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(durationProp || 0);
  const [repeat, setRepeat] = useState<"off" | "one">("off");
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    durationPropRef.current = durationProp;
  }, [durationProp]);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const progressPct = Math.min(
    100,
    (currentTime / Math.max(duration, 1)) * 100,
  );

  useEffect(() => {
    if (!audioSrc) return;

    // Clean up previous audio if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioSrc);
    audio.volume = volumeRef.current;
    audioRef.current = audio;

    const onLoaded = () =>
      setDuration(Math.max(durationPropRef.current || audio.duration || 0, 1));
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnd = () => {
      if (repeat === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlaying(false);
        onNext?.();
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    // Auto-play when audioSrc changes
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Auto-play blocked or failed:", err);
        setIsPlaying(false);
      });

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
  }, [audioSrc, repeat, onNext]);

  // Internal timer fallback if audioSrc is missing (redundant if we always have src, but kept for safety)
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

  function togglePlayPause() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      setIsPlaying((p) => !p);
    }
  }

  function seekTo(t: number) {
    const clamped = Math.max(0, Math.min(duration, t));
    setCurrentTime(clamped);
    if (audioRef.current) audioRef.current.currentTime = clamped;
  }

  function changeVolume(val: number) {
    const v = Math.max(0, Math.min(1, val));
    setVolume(v);
  }

  return {
    isPlaying,
    currentTime,
    duration,
    repeat,
    shuffle,
    volume,
    progressPct,
    togglePlayPause,
    seekTo,
    setRepeat,
    setShuffle,
    changeVolume,
  };
}
