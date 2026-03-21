"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { searchSongs, SaavnSong } from "@/services/jioSaavnApi";
import { getSongImage } from "@/utils/imageUtils";
import Skeleton from "@/components/skeleton/Skeleton";

const GENRE_GRADIENTS: Record<string, string> = {
  Pop: "from-pink-500 to-rose-400",
  "Hip-Hop": "from-orange-500 to-yellow-400",
  Rock: "from-gray-600 to-slate-800",
  Electronic: "from-cyan-500 to-blue-600",
  Chill: "from-teal-500 to-emerald-400",
  Workout: "from-red-600 to-orange-500",
  Jazz: "from-amber-600 to-yellow-700",
  "R&B": "from-purple-600 to-violet-500",
};

function decodeEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&");
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface CategoryCardProps {
  genre: string;
  gradient: string; // Tailwind gradient class, e.g. "from-purple-600 to-blue-500"
  onClick: (genre: string) => void;
}

function CategoryCard({ genre, gradient, onClick }: CategoryCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl min-h-[100px] flex items-end p-4 cursor-pointer hover:scale-105 hover:brightness-110 transition-transform`}
      onClick={() => onClick(genre)}
    >
      <span className="font-bold text-white text-base">{genre}</span>
    </div>
  );
}

interface BrowseSectionProps {
  onGenreClick: (genre: string) => void;
}

function BrowseSection({ onGenreClick }: BrowseSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Browse all</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(GENRE_GRADIENTS).map(([genre, gradient]) => (
          <CategoryCard
            key={genre}
            genre={genre}
            gradient={gradient}
            onClick={onGenreClick}
          />
        ))}
      </div>
    </div>
  );
}

interface TopResultCardProps {
  song: SaavnSong;
  onClick: (id: string) => void;
}

function TopResultCard({ song, onClick }: TopResultCardProps) {
  return (
    <div
      className="bg-neutral-900 rounded-2xl p-6 cursor-pointer hover:bg-neutral-800 transition-colors"
      onClick={() => onClick(song.id)}
    >
      <img
        src={getSongImage(song)}
        alt={song.name}
        className="w-20 h-20 rounded-xl object-cover mb-4"
      />
      <p className="text-white text-xl font-bold truncate mb-1">
        {decodeEntities(song.name)}
      </p>
      <p className="text-gray-400 text-sm truncate mb-3">
        {song.primaryArtists}
      </p>
      <span className="inline-block bg-neutral-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
        Song
      </span>
    </div>
  );
}

interface SongRowProps {
  song: SaavnSong;
  onClick: (id: string) => void;
}

function SongRow({ song, onClick }: SongRowProps) {
  return (
    <div
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer w-full text-left"
      onClick={() => onClick(song.id)}
    >
      <img
        src={getSongImage(song)}
        alt={song.name}
        className="w-[50px] h-[50px] rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">
          {decodeEntities(song.name)}
        </p>
        <p className="text-gray-400 text-xs truncate mt-0.5">
          {song.primaryArtists}
        </p>
      </div>
      <span className="text-gray-500 text-xs flex-shrink-0">
        {formatDuration(song.duration)}
      </span>
    </div>
  );
}

function SplitLayoutSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 mt-4">
      {/* Left: large block */}
      <div className="bg-neutral-900 rounded-2xl p-6">
        <Skeleton className="w-full h-48 rounded-2xl mb-4" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      {/* Right: row skeletons */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-24 mb-2" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-xl bg-neutral-900"
          >
            <Skeleton className="w-[50px] h-[50px] rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-3 w-10 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchSongPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [results, setResults] = useState<SaavnSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults([]);
      setError(null);
      setHasSearched(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchSongs(trimmed, 20);
        if (!cancelled) {
          setResults(data);
          setHasSearched(true);
        }
      } catch {
        if (!cancelled) {
          setError("Something went wrong. Please try again.");
          setResults([]);
          setHasSearched(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const handleSongClick = (id: string) => {
    router.push(`/songPlay?id=${id}`);
  };

  const handleGenreClick = (genre: string) => {
    setQuery(genre);
  };

  const showGenreChips = query.trim() === "";
  const showNoResults =
    hasSearched &&
    !isLoading &&
    !error &&
    results.length === 0 &&
    debouncedQuery.trim() !== "";

  return (
    <div
      className="px-4 sm:px-6 md:px-10 lg:px-20 py-6 md:pr-[84px] pb-24 md:pb-8 min-h-screen"
      style={{ background: "#0a0a0a" }}
    >
      {/* Search input */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Search</h1>
        <div className="flex items-center gap-3 bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-cyan-400/60 transition-colors">
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Artists, songs, or podcasts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-white text-base outline-none placeholder-gray-500 flex-1"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Browse all — shown when query is empty */}
      {showGenreChips && (
        <div className="mb-6">
          <BrowseSection onGenreClick={handleGenreClick} />
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && <SplitLayoutSkeleton />}

      {/* Error state */}
      {!isLoading && error && (
        <div className="mt-6 text-center text-red-400 text-sm">{error}</div>
      )}

      {/* No results */}
      {showNoResults && (
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm">
            No results found for &ldquo;{debouncedQuery.trim()}&rdquo;
          </p>
        </div>
      )}

      {/* Split results layout */}
      {!isLoading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
          {/* Left: Top result */}
          <div>
            <p className="text-lg font-bold text-white mb-3">Top result</p>
            <TopResultCard song={results[0]} onClick={handleSongClick} />
          </div>
          {/* Right: Songs list */}
          <div>
            <p className="text-lg font-bold text-white mb-3">Songs</p>
            <div className="flex flex-col">
              {results.slice(1).map((song) => (
                <SongRow key={song.id} song={song} onClick={handleSongClick} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
