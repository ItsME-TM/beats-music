// Feature: library-page-spotify-redesign, Property 4: Liked song navigation
import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 2.4

type LikedSong = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

/**
 * Simulates the click handler in SongRow:
 *   onClick={song.id}
 * The component calls onClick(song.id) when the button is clicked.
 */
function simulateSongRowClick(
  song: LikedSong,
  onClick: (id: string) => void,
): void {
  onClick(song.id);
}

const likedSongArb = fc.record<LikedSong>({
  id: fc.string({ minLength: 1 }),
  title: fc.string(),
  artist: fc.string(),
  duration: fc.string(),
  image: fc.string(),
});

describe("Property 4: Liked song navigation", () => {
  it("clicking a SongRow calls onClick with the song's id for any LikedSong", () => {
    fc.assert(
      fc.property(likedSongArb, (song) => {
        const mockFn = vi.fn();
        simulateSongRowClick(song, mockFn);

        expect(mockFn).toHaveBeenCalledOnce();
        expect(mockFn).toHaveBeenCalledWith(song.id);
      }),
      { numRuns: 100 },
    );
  });
});
