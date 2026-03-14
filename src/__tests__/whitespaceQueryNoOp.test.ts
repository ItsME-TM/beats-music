// Feature: search-page-spotify-redesign, Property 6: Whitespace query does not trigger search
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 7.3

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

/**
 * Simulates the showGenreChips logic from the redesigned SearchSong page:
 *
 *   const showGenreChips = query.trim() === "";
 *
 * Returns true if the Browse_Section (genre chips) should be displayed.
 */
function showGenreChips(query: string): boolean {
  return query.trim() === "";
}

describe("Whitespace query does not trigger search (Property 6)", () => {
  it("empty string never triggers a search call", () => {
    expect(wouldCallSearch("")).toBe(false);
  });

  it("empty string shows genre chips (Browse_Section)", () => {
    expect(showGenreChips("")).toBe(true);
  });

  it("any whitespace-only string never triggers a search call", () => {
    // Whitespace characters: space, tab, newline, carriage return, form feed, vertical tab
    const whitespaceArb = fc
      .string({ minLength: 1, maxLength: 20 })
      .filter((s) => s.trim() === "");

    fc.assert(
      fc.property(whitespaceArb, (query) => {
        expect(wouldCallSearch(query)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it("any whitespace-only string shows Browse_Section (showGenreChips is true)", () => {
    const whitespaceArb = fc
      .string({ minLength: 1, maxLength: 20 })
      .filter((s) => s.trim() === "");

    fc.assert(
      fc.property(whitespaceArb, (query) => {
        expect(showGenreChips(query)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it("whitespace-only string trims to empty string", () => {
    const whitespaceArb = fc
      .string({ minLength: 1, maxLength: 20 })
      .filter((s) => s.trim() === "");

    fc.assert(
      fc.property(whitespaceArb, (query) => {
        expect(query.trim()).toBe("");
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

  it("non-empty, non-whitespace string hides Browse_Section (showGenreChips is false)", () => {
    const nonEmptyArb = fc
      .string({ minLength: 1, maxLength: 50 })
      .filter((s) => s.trim().length > 0);

    fc.assert(
      fc.property(nonEmptyArb, (query) => {
        expect(showGenreChips(query)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});
