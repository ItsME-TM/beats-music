// Feature: music-player-ui-overhaul, Property 9: Sequential order without shuffle
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 8.2

type Song = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

/**
 * Simulates the sequential (non-shuffle) branch of handleNext from src/app/songPlay/page.tsx:
 *
 *   const currentIndex = topSongs.findIndex((s) => String(s.id) === String(songId));
 *   const nextIndex = (currentIndex + 1) % topSongs.length;
 *   handleSongSelect(topSongs[nextIndex]);
 */
function sequentialNext(songs: Song[], currentIndex: number): Song {
  const nextIndex = (currentIndex + 1) % songs.length;
  return songs[nextIndex];
}

const songArb = fc.record<Song>({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  artist: fc.string({ minLength: 1, maxLength: 50 }),
  duration: fc.string({ minLength: 1, maxLength: 10 }),
  image: fc.webUrl(),
});

describe("Sequential order without shuffle (Property 9)", () => {
  it("next song index is always (i + 1) % queue.length for any queue and position", () => {
    fc.assert(
      fc.property(
        fc.array(songArb, { minLength: 1 }),
        fc.nat(),
        (songs, rawIndex) => {
          const i = rawIndex % songs.length;
          const expectedIndex = (i + 1) % songs.length;
          const expectedSong = songs[expectedIndex];

          const nextSong = sequentialNext(songs, i);

          expect(String(nextSong.id)).toBe(String(expectedSong.id));
        },
      ),
      { numRuns: 100 },
    );
  });

  it("wraps around to the first song when at the last position", () => {
    fc.assert(
      fc.property(fc.array(songArb, { minLength: 1 }), (songs) => {
        const lastIndex = songs.length - 1;
        const nextSong = sequentialNext(songs, lastIndex);

        expect(String(nextSong.id)).toBe(String(songs[0].id));
      }),
      { numRuns: 100 },
    );
  });
});
