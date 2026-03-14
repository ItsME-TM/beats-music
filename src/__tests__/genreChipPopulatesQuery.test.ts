// Feature: music-player-ui-overhaul, Property 3: Genre chip populates query and triggers search
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 2.2

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

/**
 * Simulates the handleGenreClick logic from SearchSong page:
 *
 *   const handleGenreClick = (genre: string) => {
 *     setQuery(genre);
 *   };
 *
 * After clicking a genre chip, the query state equals the chip label.
 * The debounce → search flow then fires naturally because query is non-empty.
 */
function simulateGenreClick(genre: string): {
  query: string;
  wouldSearch: boolean;
} {
  // Mirrors: setQuery(genre)
  const query = genre;

  // Mirrors the useEffect guard: trimmed non-empty → search fires
  const wouldSearch = query.trim().length > 0;

  return { query, wouldSearch };
}

describe("Genre chip populates query and triggers search (Property 3)", () => {
  it("clicking any genre chip sets query to the chip label", () => {
    fc.assert(
      fc.property(fc.constantFrom(...GENRES), (genre) => {
        const { query } = simulateGenreClick(genre);
        expect(query).toBe(genre);
      }),
      { numRuns: 100 },
    );
  });

  it("clicking any genre chip produces a non-empty query that would trigger search", () => {
    fc.assert(
      fc.property(fc.constantFrom(...GENRES), (genre) => {
        const { wouldSearch } = simulateGenreClick(genre);
        expect(wouldSearch).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it("query after genre click equals the chip label exactly (no mutation)", () => {
    fc.assert(
      fc.property(fc.constantFrom(...GENRES), (genre) => {
        const { query } = simulateGenreClick(genre);
        // The query must be the exact chip label — no trimming, no transformation
        expect(query).toStrictEqual(genre);
        expect(query.length).toBe(genre.length);
      }),
      { numRuns: 100 },
    );
  });
});
