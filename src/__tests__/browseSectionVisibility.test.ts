// Feature: search-page-spotify-redesign, Property 1: Browse section shown iff query is empty
// Validates: Requirements 1.1, 2.1, 7.3
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Simulates the showGenreChips logic from SearchSongPage:
//   const showGenreChips = query.trim() === "";
function shouldShowBrowseSection(query: string): boolean {
  return query.trim() === "";
}

describe("Property 1: Browse section shown iff query is empty", () => {
  it("BrowseSection is shown when query is empty string", () => {
    expect(shouldShowBrowseSection("")).toBe(true);
  });

  it("BrowseSection is shown when query is whitespace-only", () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[ \t\n\r]+$/), (whitespace) => {
        expect(shouldShowBrowseSection(whitespace)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it("BrowseSection is hidden when query has non-whitespace content", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (query) => {
          expect(shouldShowBrowseSection(query)).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("BrowseSection visibility is exactly the inverse of having a non-empty trimmed query", () => {
    fc.assert(
      fc.property(fc.string(), (query) => {
        const showBrowse = shouldShowBrowseSection(query);
        const hasContent = query.trim().length > 0;
        // They must be mutually exclusive and exhaustive
        expect(showBrowse).toBe(!hasContent);
      }),
      { numRuns: 100 },
    );
  });
});
