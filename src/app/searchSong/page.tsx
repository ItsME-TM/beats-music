"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { searchSongs, SaavnSong } from "@/services/jioSaavnApi";
import { getSongImage } from "@/utils/imageUtils";
import Skeleton from "@/components/skeleton/Skeleton";

const GENRES = [
  "Pop",
  "Hip-Hop",
  "Rock",
  "Electronic",
  "Chill",
  "Workout",
  "Jazz",
  "R&B",
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-3 mt-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-3 rounded-xl bg-neutral-900"
        >
          <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3 w-10 flex-shrink-0" />
        </div>
      ))}
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

  const showGenreChips = query === "";
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

      {/* Genre chips — shown when query is empty */}
      {showGenreChips && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Browse by genre
          </h2>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 bg-neutral-900 text-gray-300 hover:border-cyan-400/60 hover:text-cyan-400 transition-colors"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active genre chips — shown when query matches a genre */}
      {!showGenreChips && GENRES.includes(query) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                genre === query
                  ? "border-cyan-400 text-cyan-400 bg-cyan-400/10"
                  : "border-white/10 bg-neutral-900 text-gray-300 hover:border-cyan-400/60 hover:text-cyan-400"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && <SearchSkeleton />}

      {/* Error state */}
      {!isLoading && error && (
        <div className="mt-6 text-center text-red-400 text-sm">{error}</div>
      )}

      {/* No results */}
      {showNoResults && (
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-base">
            No results found for &ldquo;{debouncedQuery.trim()}&rdquo;
          </p>
        </div>
      )}

      {/* Results list */}
      {!isLoading && !error && results.length > 0 && (
        <div className="flex flex-col gap-2">
          {results.map((song) => (
            <button
              key={song.id}
              onClick={() => handleSongClick(song.id)}
              className="flex items-center gap-4 p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors text-left w-full group"
            >
              {/* Cover image */}
              <img
                src={getSongImage(song)}
                alt={song.name}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              {/* Title + artist */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-400 transition-colors">
                  {song.name
                    .replace(/&quot;/g, '"')
                    .replace(/&#039;/g, "'")
                    .replace(/&amp;/g, "&")}
                </p>
                <p className="text-gray-400 text-xs truncate mt-0.5">
                  {song.primaryArtists}
                </p>
              </div>
              {/* Duration */}
              <span className="text-gray-500 text-xs flex-shrink-0">
                {formatDuration(song.duration)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
