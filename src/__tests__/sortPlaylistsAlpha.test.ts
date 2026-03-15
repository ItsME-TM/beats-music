// Feature: library-page-spotify-redesign, Property 5: Alphabetical sort correctness
import { describe, it } from "vitest";
import * as fc from "fast-check";
import { sortPlaylists } from "../utils/sortPlaylists";

/**
 * Validates: Requirements 4.5
 *
 * For any array of playlists, when sorted with "alpha", each adjacent pair
 * satisfies a.name.localeCompare(b.name) <= 0 (ascending alphabetical order).
 */
describe("sortPlaylists - alphabetical sort correctness (P5)", () => {
  it("sorts playlists by name in ascending localeCompare order", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.integer(),
            name: fc.string(),
            description: fc.option(fc.string(), { nil: undefined }),
          }),
        ),
        (arr) => {
          const sorted = sortPlaylists(arr, "alpha");
          for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].name.localeCompare(sorted[i + 1].name) > 0) {
              return false;
            }
          }
          return true;
        },
      ),
      { numRuns: 100 },
    );
  });
});
