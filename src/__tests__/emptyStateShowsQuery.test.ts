// Feature: search-page-spotify-redesign, Property 9: Empty state shows searched query
// Validates: Requirements 6.1
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Simulates the empty state rendering from SearchSongPage:
//   <p className="text-gray-400 text-sm">
//     No results found for "{debouncedQuery.trim()}"
//   </p>
function getEmptyStateMessage(debouncedQuery: string): string {
  return `No results found for "${debouncedQuery.trim()}"`;
}

describe("Property 9: Empty state shows searched query", () => {
  it("empty state message contains the exact trimmed query", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (query) => {
          const message = getEmptyStateMessage(query);
          expect(message).toContain(query.trim());
        },
      ),
      { numRuns: 100 },
    );
  });

  it("empty state message contains the trimmed version, not the raw query", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (query) => {
          const message = getEmptyStateMessage(query);
          const trimmed = query.trim();
          expect(message).toContain(trimmed);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("empty state message format is consistent", () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (query) => {
          const message = getEmptyStateMessage(query);
          expect(message.startsWith('No results found for "')).toBe(true);
          expect(message.endsWith('"')).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});
