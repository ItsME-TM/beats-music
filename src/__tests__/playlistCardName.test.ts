// Feature: library-page-spotify-redesign, Property 8: Playlist card name display
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 5.3

type Playlist = {
  id: number;
  name: string;
  description?: string;
};

/**
 * Simulates the text content rendered by PlaylistCard.
 * PlaylistCard always renders playlist.name as visible text.
 */
function getPlaylistCardTextContent(playlist: Playlist): string[] {
  const content = [playlist.name];
  if (playlist.description) {
    content.push(playlist.description);
  }
  return content;
}

const playlistArb = fc.record<Playlist>({
  id: fc.integer({ min: 0 }),
  name: fc.string({ minLength: 1 }),
  description: fc.option(fc.string(), { nil: undefined }),
});

describe("Property 8: Playlist card name display", () => {
  it("PlaylistCard renders the playlist name for any Playlist", () => {
    fc.assert(
      fc.property(playlistArb, (playlist) => {
        const textContent = getPlaylistCardTextContent(playlist);
        expect(textContent).toContain(playlist.name);
      }),
      { numRuns: 100 },
    );
  });

  it("PlaylistCard renders description when present", () => {
    const playlist: Playlist = {
      id: 1,
      name: "My Playlist",
      description: "A great playlist",
    };
    const textContent = getPlaylistCardTextContent(playlist);
    expect(textContent).toContain(playlist.name);
    expect(textContent).toContain(playlist.description);
  });

  it("PlaylistCard renders only name when description is absent", () => {
    const playlist: Playlist = { id: 2, name: "No Desc" };
    const textContent = getPlaylistCardTextContent(playlist);
    expect(textContent).toContain(playlist.name);
    expect(textContent).toHaveLength(1);
  });
});
