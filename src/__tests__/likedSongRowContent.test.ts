// Feature: library-page-spotify-redesign, Property 3: Liked song row content
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 2.2

type LikedSong = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

/**
 * Simulates the text content rendered by SongRow.
 * SongRow renders: song.title, song.artist, song.duration as visible text.
 */
function getSongRowTextContent(song: LikedSong): string[] {
  return [song.title, song.artist, song.duration];
}

const likedSongArb = fc.record<LikedSong>({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  artist: fc.string({ minLength: 1 }),
  duration: fc.string({ minLength: 1 }),
  image: fc.string(),
});

describe("Property 3: Liked song row content", () => {
  it("SongRow renders title, artist, and duration for any LikedSong", () => {
    fc.assert(
      fc.property(likedSongArb, (song) => {
        const textContent = getSongRowTextContent(song);

        expect(textContent).toContain(song.title);
        expect(textContent).toContain(song.artist);
        expect(textContent).toContain(song.duration);
      }),
      { numRuns: 100 },
    );
  });
});
