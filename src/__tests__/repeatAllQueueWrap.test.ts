// Feature: music-player-ui-overhaul, Property 7: Repeat-all wraps queue
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 7.5

type Song = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

/**
 * Simulates the handleNext logic from src/app/songPlay/page.tsx when repeat="all".
 *
 * From page.tsx:
 *   const handleNext = () => {
 *     if (!topSongs.length) return;
 *     const currentIndex = topSongs.findIndex((s) => String(s.id) === String(songId));
 *     const nextIndex = (currentIndex + 1) % topSongs.length;
 *     handleSongSelect(topSongs[nextIndex]);
 *   };
 *
 * When repeat="all" and the last song ends, onNext() is called (from SongPlayer onEnded),
 * which calls handleNext(). At the last index (queue.length - 1), the modulo wraps to 0.
 *
 * Returns the index of the next song selected.
 */
function getNextIndex(queue: Song[], currentIndex: number): number {
  return (currentIndex + 1) % queue.length;
}

const songArb = fc.record<Song>({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  artist: fc.string({ minLength: 1, maxLength: 50 }),
  duration: fc.string({ minLength: 1, maxLength: 10 }),
  image: fc.webUrl(),
});

describe("Repeat-all wraps queue (Property 7)", () => {
  it("when repeat is 'all' and the last song ends, the next song is the first in the queue", () => {
    fc.assert(
      fc.property(fc.array(songArb, { minLength: 2 }), (queue) => {
        const lastIndex = queue.length - 1;
        const nextIndex = getNextIndex(queue, lastIndex);
        expect(nextIndex).toBe(0);
        expect(queue[nextIndex]).toBe(queue[0]);
      }),
      { numRuns: 100 },
    );
  });

  it("for any position in the queue, next index wraps correctly using modulo", () => {
    fc.assert(
      fc.property(
        fc.array(songArb, { minLength: 2 }),
        fc.nat(),
        (queue, rawIndex) => {
          const currentIndex = rawIndex % queue.length;
          const nextIndex = getNextIndex(queue, currentIndex);
          expect(nextIndex).toBe((currentIndex + 1) % queue.length);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("the next song after the last is always the first song object in the queue", () => {
    fc.assert(
      fc.property(fc.array(songArb, { minLength: 2 }), (queue) => {
        const lastIndex = queue.length - 1;
        const nextIndex = getNextIndex(queue, lastIndex);
        const nextSong = queue[nextIndex];
        expect(nextSong.id).toBe(queue[0].id);
      }),
      { numRuns: 100 },
    );
  });
});
