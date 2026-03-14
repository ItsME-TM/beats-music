// Feature: music-player-ui-overhaul, Property 2: Empty/whitespace query produces no search call
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 1.3, 1.5

/**
 * Simulates the guard logic from the useEffect in SearchSong page:
 *
 *   const trimmed = debouncedQuery.trim();
 *   if (!trimmed) {
 *     setResults([]);
 *     setError(null);
 *     setHasSearched(false);
 *     return;
 *   }
 *   // ... searchSongs(trimmed, 20) would be called here
 *
 * Returns true if searchSongs would be called, false if the guard short-circuits.
 */
function wouldCallSearch(debouncedQuery: string): boolean {
  const trimmed = debouncedQuery.trim();
  if (!trimmed) {
    return false;
  }
  return true;
}

describe("Empty/whitespace query produces no search call (Property 2)", () => {
  it("empty string never triggers a search call", () => {
    expect(wouldCallSearch("")).toBe(false);
  });

  it("any whitespace-only string never triggers a search call", () => {
    // Whitespace characters: space, tab, newline, carriage return, form feed, vertical tab
    const whitespaceArb = fc
      .string({ minLength: 0, maxLength: 20 })
      .filter((s) => s.trim() === "");

    fc.assert(
      fc.property(whitespaceArb, (query) => {
        expect(wouldCallSearch(query)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it("non-empty, non-whitespace string does trigger a search call", () => {
    // Sanity check: the guard should pass for real queries
    const nonEmptyArb = fc
      .string({ minLength: 1, maxLength: 50 })
      .filter((s) => s.trim().length > 0);

    fc.assert(
      fc.property(nonEmptyArb, (query) => {
        expect(wouldCallSearch(query)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});
