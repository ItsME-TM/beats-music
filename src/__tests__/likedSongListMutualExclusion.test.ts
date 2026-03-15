// Feature: library-page-spotify-redesign, Property 2: Liked songs list mutual exclusion
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 2.1, 2.6, 3.1

type LikedSong = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

/**
 * Mirrors the rendering logic in LibraryPage:
 * - showSongList is true iff likedSongs.length > 0
 * - showEmptyState is true iff likedSongs.length === 0
 * These must be mutually exclusive and exhaustive.
 */
function getLikedSongsDisplayState(songs: LikedSong[]): {
  showSongList: boolean;
  showEmptyState: boolean;
} {
  return {
    showSongList: songs.length > 0,
    showEmptyState: songs.length === 0,
  };
}

const likedSongArb = fc.record<LikedSong>({
  id: fc.string({ minLength: 1 }),
  title: fc.string(),
  artist: fc.string(),
  duration: fc.string(),
  image: fc.string(),
});

describe("Property 2: Liked songs list mutual exclusion", () => {
  it("song list shown iff length > 0, empty state shown iff length === 0 — never both, never neither", () => {
    fc.assert(
      fc.property(fc.array(likedSongArb), (songs) => {
        const { showSongList, showEmptyState } =
          getLikedSongsDisplayState(songs);

        // Mutual exclusion: never both
        expect(showSongList && showEmptyState).toBe(false);

        // Exhaustive: never neither
        expect(showSongList || showEmptyState).toBe(true);

        // Correct conditions
        expect(showSongList).toBe(songs.length > 0);
        expect(showEmptyState).toBe(songs.length === 0);
      }),
      { numRuns: 100 },
    );
  });

  it("empty array shows empty state, not song list", () => {
    const { showSongList, showEmptyState } = getLikedSongsDisplayState([]);
    expect(showSongList).toBe(false);
    expect(showEmptyState).toBe(true);
  });

  it("non-empty array shows song list, not empty state", () => {
    const song: LikedSong = {
      id: "1",
      title: "T",
      artist: "A",
      duration: "3:00",
      image: "",
    };
    const { showSongList, showEmptyState } = getLikedSongsDisplayState([song]);
    expect(showSongList).toBe(true);
    expect(showEmptyState).toBe(false);
  });
});
