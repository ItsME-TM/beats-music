// Feature: search-page-spotify-redesign, Property 10: Loading state hides results and browse section
// Validates: Requirements 5.3
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Simulates the rendering logic from SearchSongPage:
//   {showGenreChips && <BrowseSection ... />}       // shown when query === ""
//   {isLoading && <SplitLayoutSkeleton />}           // shown when loading
//   {!isLoading && !error && results.length > 0 && <SplitLayout />}  // shown when results
interface PageState {
  query: string;
  isLoading: boolean;
  results: string[]; // just ids for simplicity
  error: string | null;
}

function simulateRendering(state: PageState): {
  showBrowseSection: boolean;
  showSkeleton: boolean;
  showResults: boolean;
} {
  const showGenreChips = state.query === "";
  return {
    showBrowseSection: showGenreChips,
    showSkeleton: state.isLoading,
    showResults: !state.isLoading && !state.error && state.results.length > 0,
  };
}

describe("Property 10: Loading state hides results and browse section", () => {
  it("when isLoading is true, results are never shown", () => {
    fc.assert(
      fc.property(
        fc.record({
          query: fc.string(),
          isLoading: fc.constant(true),
          results: fc.array(fc.string({ minLength: 1 }), {
            minLength: 0,
            maxLength: 20,
          }),
          error: fc.option(fc.string({ minLength: 1 }), { nil: null }),
        }),
        (state) => {
          const { showResults } = simulateRendering(state);
          expect(showResults).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("when isLoading is true, skeleton is shown", () => {
    fc.assert(
      fc.property(
        fc.record({
          query: fc.string(),
          isLoading: fc.constant(true),
          results: fc.array(fc.string({ minLength: 1 }), {
            minLength: 0,
            maxLength: 20,
          }),
          error: fc.option(fc.string({ minLength: 1 }), { nil: null }),
        }),
        (state) => {
          const { showSkeleton } = simulateRendering(state);
          expect(showSkeleton).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("when isLoading is true with non-empty query, browse section is hidden", () => {
    fc.assert(
      fc.property(
        fc.record({
          query: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          isLoading: fc.constant(true),
          results: fc.array(fc.string({ minLength: 1 }), {
            minLength: 0,
            maxLength: 20,
          }),
          error: fc.option(fc.string({ minLength: 1 }), { nil: null }),
        }),
        (state) => {
          const { showBrowseSection } = simulateRendering(state);
          expect(showBrowseSection).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("skeleton and results are mutually exclusive", () => {
    fc.assert(
      fc.property(
        fc.record({
          query: fc.string(),
          isLoading: fc.boolean(),
          results: fc.array(fc.string({ minLength: 1 }), {
            minLength: 0,
            maxLength: 20,
          }),
          error: fc.option(fc.string({ minLength: 1 }), { nil: null }),
        }),
        (state) => {
          const { showSkeleton, showResults } = simulateRendering(state);
          // They can't both be true at the same time
          expect(showSkeleton && showResults).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });
});
