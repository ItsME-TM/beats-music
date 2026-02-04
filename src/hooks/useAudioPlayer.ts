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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(durationProp || 0);
  const [repeat, setRepeat] = useState<"off" | "one">("off");
  const [shuffle, setShuffle] = useState(false);

  const progressPct = Math.min(
    100,
    (currentTime / Math.max(duration, 1)) * 100
  );

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
        audio.play().catch(() => {});
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
  }, [audioSrc, repeat, durationProp, onNext]);

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

  return {
    isPlaying,
    currentTime,
    duration,
    repeat,
    shuffle,
    progressPct,
    togglePlayPause,
    seekTo,
    setRepeat,
    setShuffle,
  };
}
