// Feature: library-page-spotify-redesign, Property 6: Recents sort correctness
import { describe, it } from "vitest";
import * as fc from "fast-check";
import { sortPlaylists } from "../utils/sortPlaylists";

/**
 * Validates: Requirements 4.6
 *
 * For any array of playlists, when sorted with "recents" or "recentlyAdded",
 * each adjacent pair satisfies a.id >= b.id (descending id order).
 */
describe("sortPlaylists - recents sort correctness (P6)", () => {
  const playlistArb = fc.array(
    fc.record({
      id: fc.integer(),
      name: fc.string(),
      description: fc.option(fc.string(), { nil: undefined }),
    }),
  );

  it('sorts playlists by id descending for "recents"', () => {
    fc.assert(
      fc.property(playlistArb, (arr) => {
        const sorted = sortPlaylists(arr, "recents");
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].id < sorted[i + 1].id) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 100 },
    );
  });

  it('sorts playlists by id descending for "recentlyAdded"', () => {
    fc.assert(
      fc.property(playlistArb, (arr) => {
        const sorted = sortPlaylists(arr, "recentlyAdded");
        for (let i = 0; i < sorted.length - 1; i++) {
          if (sorted[i].id < sorted[i + 1].id) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 100 },
    );
  });
});
