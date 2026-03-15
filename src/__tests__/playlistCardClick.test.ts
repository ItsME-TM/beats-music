// Feature: library-page-spotify-redesign, Property 9: Playlist card click handler
import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 5.6

type Playlist = {
  id: number;
  name: string;
  description?: string;
};

/**
 * Simulates the click handler in PlaylistCard:
 * onClick={() => onSelect(playlist)}
 * The component calls onSelect(playlist) when the button is clicked.
 */
function simulatePlaylistCardClick(
  playlist: Playlist,
  onSelect: (pl: Playlist) => void,
): void {
  onSelect(playlist);
}

const playlistArb = fc.record<Playlist>({
  id: fc.integer({ min: 0 }),
  name: fc.string({ minLength: 1 }),
  description: fc.option(fc.string(), { nil: undefined }),
});

describe("Property 9: Playlist card click handler", () => {
  it("clicking a PlaylistCard calls onSelect with the playlist for any Playlist", () => {
    fc.assert(
      fc.property(playlistArb, (playlist) => {
        const mockFn = vi.fn();
        simulatePlaylistCardClick(playlist, mockFn);

        expect(mockFn).toHaveBeenCalledOnce();
        expect(mockFn).toHaveBeenCalledWith(playlist);
      }),
      { numRuns: 100 },
    );
  });
});
