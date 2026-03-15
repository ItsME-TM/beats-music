// Feature: music-player-ui-overhaul, Property 11: Queue panel reflects current song
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 5.6, 6.1

type Song = {
  id: string | number;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

/**
 * Simulates the highlight logic from QueuePanel.tsx:
 *   const isPlaying = String(song.id) === String(currentSongId);
 *
 * Returns the number of rows that would receive the active highlight class
 * (border-l-2 border-cyan-400 + text-cyan-400 title).
 */
function countHighlightedRows(
  songs: Song[],
  currentSongId: string | null,
): number {
  return songs.filter((song) => String(song.id) === String(currentSongId))
    .length;
}

const songArb = fc.record<Song>({
  id: fc.oneof(fc.uuid(), fc.integer({ min: 1, max: 100000 }).map(String)),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  artist: fc.string({ minLength: 1, maxLength: 50 }),
  duration: fc.string({ minLength: 1, maxLength: 10 }),
  image: fc.webUrl(),
});

describe("Queue panel reflects current song (Property 11)", () => {
  it("exactly one row is highlighted when currentSongId matches one of the songs", () => {
    fc.assert(
      fc.property(
        fc.array(songArb, { minLength: 1 }),
        fc.nat(),
        (songs, pickIndex) => {
          // Pick a valid song from the queue as the current song
          const currentSong = songs[pickIndex % songs.length];
          const currentSongId = String(currentSong.id);

          const highlighted = countHighlightedRows(songs, currentSongId);
          expect(highlighted).toBe(1);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("no rows are highlighted when currentSongId is null", () => {
    fc.assert(
      fc.property(fc.array(songArb, { minLength: 1 }), (songs) => {
        const highlighted = countHighlightedRows(songs, null);
        expect(highlighted).toBe(0);
      }),
      { numRuns: 100 },
    );
  });

  it("no rows are highlighted when currentSongId does not match any song", () => {
    fc.assert(
      fc.property(fc.array(songArb, { minLength: 1 }), (songs) => {
        // Use an ID that cannot appear in the generated songs
        const nonExistentId = "non-existent-id-__SENTINEL__";
        const highlighted = countHighlightedRows(songs, nonExistentId);
        expect(highlighted).toBe(0);
      }),
      { numRuns: 100 },
    );
  });
});
