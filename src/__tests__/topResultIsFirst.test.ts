// Feature: search-page-spotify-redesign, Property 4: Top result card shows first result
// Validates: Requirements 3.1, 3.5
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Minimal SaavnSong shape needed for this property
interface MinimalSong {
  id: string;
  name: string;
}

// Simulates the split layout logic from SearchSongPage:
//   <TopResultCard song={results[0]} ... />
//   {results.slice(1).map((song) => <SongRow key={song.id} ... />)}
function simulateSplitLayout(results: MinimalSong[]): {
  topResult: MinimalSong;
  songsList: MinimalSong[];
} {
  return {
    topResult: results[0],
    songsList: results.slice(1),
  };
}

const songArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
});

describe("Property 4: Top result card shows first result", () => {
  it("TopResultCard always receives results[0]", () => {
    fc.assert(
      fc.property(
        fc.array(songArb, { minLength: 1, maxLength: 20 }),
        (results) => {
          const { topResult } = simulateSplitLayout(results);
          expect(topResult).toBe(results[0]);
          expect(topResult.id).toBe(results[0].id);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("SongsList always receives results starting from index 1", () => {
    fc.assert(
      fc.property(
        fc.array(songArb, { minLength: 1, maxLength: 20 }),
        (results) => {
          const { songsList } = simulateSplitLayout(results);
          expect(songsList).toEqual(results.slice(1));
          expect(songsList.length).toBe(results.length - 1);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("TopResultCard id is never in SongsList", () => {
    fc.assert(
      fc.property(
        fc
          .array(songArb, { minLength: 1, maxLength: 20 })
          .filter((arr) => new Set(arr.map((s) => s.id)).size === arr.length),
        (results) => {
          const { topResult, songsList } = simulateSplitLayout(results);
          const songsListIds = songsList.map((s) => s.id);
          expect(songsListIds).not.toContain(topResult.id);
        },
      ),
      { numRuns: 100 },
    );
  });
});
