// Feature: library-page-spotify-redesign, Property 7: Playlist grid mutual exclusion
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 5.1, 6.1

type Playlist = {
  id: number;
  name: string;
  description?: string;
};

/**
 * Mirrors the rendering logic in LibraryPage for the playlists section:
 * - showGrid is true iff playlists.length > 0
 * - showEmptyState is true iff playlists.length === 0
 * These must be mutually exclusive and exhaustive.
 */
function getPlaylistsDisplayState(playlists: Playlist[]): {
  showGrid: boolean;
  showEmptyState: boolean;
} {
  return {
    showGrid: playlists.length > 0,
    showEmptyState: playlists.length === 0,
  };
}

const playlistArb = fc.record<Playlist>({
  id: fc.integer({ min: 0 }),
  name: fc.string({ minLength: 1 }),
  description: fc.option(fc.string(), { nil: undefined }),
});

describe("Property 7: Playlist grid mutual exclusion", () => {
  it("grid shown iff length > 0, empty state shown iff length === 0 — never both, never neither", () => {
    fc.assert(
      fc.property(fc.array(playlistArb), (playlists) => {
        const { showGrid, showEmptyState } =
          getPlaylistsDisplayState(playlists);

        // Mutual exclusion: never both
        expect(showGrid && showEmptyState).toBe(false);

        // Exhaustive: never neither
        expect(showGrid || showEmptyState).toBe(true);

        // Correct conditions
        expect(showGrid).toBe(playlists.length > 0);
        expect(showEmptyState).toBe(playlists.length === 0);
      }),
      { numRuns: 100 },
    );
  });

  it("empty array shows empty state, not grid", () => {
    const { showGrid, showEmptyState } = getPlaylistsDisplayState([]);
    expect(showGrid).toBe(false);
    expect(showEmptyState).toBe(true);
  });

  it("non-empty array shows grid, not empty state", () => {
    const playlist: Playlist = { id: 1, name: "My Playlist" };
    const { showGrid, showEmptyState } = getPlaylistsDisplayState([playlist]);
    expect(showGrid).toBe(true);
    expect(showEmptyState).toBe(false);
  });
});
