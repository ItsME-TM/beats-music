"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/firebase";
import { usePathname } from "next/navigation";
import ReactPlayer from "react-player";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReactPlayerAny: any = ReactPlayer;
const LS_VOLUME_KEY = "beats:volume";
const SILENT_KEEPALIVE_SRC = "/audio/silence-1s.mp3";

type PlayerTrack = {
  id: string;
  title: string;
  artists: string[];
  coverUrl?: string;
  audioSrc?: string;
  youtubeVideoId?: string;
  duration?: number;
};

type PlayerContextValue = {
  track: PlayerTrack | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  autoplayRequestAt: number | null;
  setTrack: (track: PlayerTrack, autoPlay?: boolean) => void;
  setIsPlaying: (next: boolean) => void;
  setCurrentTime: (seconds: number) => void;
  setVolume: (next: number) => void;
};

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({ user: null, loading: true });

export const PlayerContext = createContext<PlayerContextValue>({
  track: null,
  isPlaying: false,
  currentTime: 0,
  volume: 0.8,
  autoplayRequestAt: null,
  setTrack: () => undefined,
  setIsPlaying: () => undefined,
  setCurrentTime: () => undefined,
  setVolume: () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const keepAliveAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastTimeRef = useRef<number>(-1);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [track, setTrackState] = useState<PlayerTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      if (typeof window === "undefined") return 0.8;
      const raw = localStorage.getItem(LS_VOLUME_KEY);
      if (raw !== null) {
        const parsed = Number.parseFloat(raw);
        if (!Number.isNaN(parsed)) return parsed;
      }
    } catch {
      // noop
    }
    return 0.8;
  });
  const [engineReady, setEngineReady] = useState(false);
  const [autoplayRequestAt, setAutoplayRequestAt] = useState<number | null>(
    null,
  );

  const setTrack = useCallback((nextTrack: PlayerTrack, autoPlay = true) => {
    setTrackState(nextTrack);
    setCurrentTime(0);
    if (autoPlay) {
      setIsPlaying(true);
      setAutoplayRequestAt(Date.now());
    }
  }, []);

  const mediaSrc = track?.youtubeVideoId
    ? `https://www.youtube.com/watch?v=${track.youtubeVideoId}`
    : (track?.audioSrc ?? "");

  const setVolume = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(1, next));
    setVolumeState(clamped);
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LS_VOLUME_KEY, String(volume));
      }
    } catch {
      // noop
    }

    if (playerRef.current) {
      try {
        playerRef.current.volume = volume;
      } catch {
        // noop
      }
    }
  }, [volume]);

  const shouldRunBackgroundEngine =
    pathname !== "/songPlay" &&
    pathname !== "/login" &&
    pathname !== "/register";

  useEffect(() => {
    setEngineReady(false);
  }, [mediaSrc]);

  useEffect(() => {
    if (!shouldRunBackgroundEngine || !engineReady || !playerRef.current) {
      return;
    }

    try {
      if (isPlaying) playerRef.current.play();
      else playerRef.current.pause();
    } catch {
      // noop
    }
  }, [isPlaying, shouldRunBackgroundEngine, engineReady]);

  useEffect(() => {
    const keepAlive = keepAliveAudioRef.current;
    if (!keepAlive) return;

    keepAlive.loop = true;
    keepAlive.muted = false;
    // Keep it effectively silent to users while still being an active audio element.
    keepAlive.volume = 0.0001;

    // Only use keep-alive if the app needs to NOT sleep while idle.
    // If mediaSrc is playing, we DO NOT need a concurrent keep-alive track.
    const shouldKeepAlivePlaying = false;

    if (shouldKeepAlivePlaying) {
      void keepAlive.play().catch(() => {
        // Browser may reject autoplay in some situations; continue gracefully.
      });
      return;
    }

    keepAlive.pause();
    keepAlive.currentTime = 0;
  }, [shouldRunBackgroundEngine, mediaSrc, isPlaying]);

  useEffect(() => {
    const keepAlive = keepAliveAudioRef.current;

    return () => {
      if (!keepAlive) return;
      keepAlive.pause();
      keepAlive.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const playerConfig = useMemo(
    () => ({
      youtube: {
        playerVars: {
          origin: typeof window !== "undefined" ? window.location.origin : "",
        },
      },
      file: {
        forceAudio: true,
      },
    }),
    [],
  );

  const hiddenStyle = useMemo(
    () => ({
      position: "fixed" as const,
      left: -9999,
      top: -9999,
      width: 480,
      height: 270,
      opacity: 0.01,
      pointerEvents: "none" as const,
    }),
    [],
  );

  const playerValue = useMemo<PlayerContextValue>(
    () => ({
      track,
      isPlaying,
      currentTime,
      volume,
      autoplayRequestAt,
      setTrack,
      setIsPlaying,
      setCurrentTime,
      setVolume,
    }),
    [
      track,
      isPlaying,
      currentTime,
      volume,
      autoplayRequestAt,
      setTrack,
      setVolume,
    ],
  );

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-800 border-t-cyan-400" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <PlayerContext.Provider value={playerValue}>
        {children}

        <audio
          ref={keepAliveAudioRef}
          src={SILENT_KEEPALIVE_SRC}
          preload="auto"
          loop
          playsInline
          style={{ display: "none" }}
        />

        {shouldRunBackgroundEngine && mediaSrc ? (
          <div style={hiddenStyle}>
            <ReactPlayerAny
              ref={playerRef}
              src={mediaSrc}
              autoPlay={false}
              volume={volume}
              muted={false}
              width="480"
              height="270"
              onReady={() => {
                setEngineReady(true);
                try {
                  if (playerRef.current) {
                    playerRef.current.volume = volume;
                    if (Number.isFinite(currentTime) && currentTime > 0) {
                      playerRef.current.currentTime = currentTime;
                    }
                    if (isPlaying) playerRef.current.play();
                    else playerRef.current.pause();
                  }
                } catch {
                  // noop
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onTimeUpdate={(e: any) => {
                const secs = e?.currentTarget?.currentTime;
                if (Number.isFinite(secs) && secs >= 0) {
                  // Throttle updates using a ref to avoid stale closure bugs
                  // which cause the throttle to fail and fire 4+ times a second!
                  const currentSecs = Math.floor(secs);
                  if (currentSecs !== lastTimeRef.current) {
                    lastTimeRef.current = currentSecs;
                    setCurrentTime(secs);
                  }
                }
              }}
              config={playerConfig}
            />
          </div>
        ) : null}
      </PlayerContext.Provider>
    </AuthContext.Provider>
  );
}
