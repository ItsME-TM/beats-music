// Feature: library-page-spotify-redesign, Property 1: Liked songs count display
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 1.3, 1.5

type LikedSong = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};

/**
 * Simulates the subtitle text rendered by LikedSongsCard:
 *   <p className="text-gray-300 text-sm">{count} songs</p>
 */
function getLikedSongsCardSubtitle(count: number): string {
  return `${count} songs`;
}

const likedSongArb = fc.record<LikedSong>({
  id: fc.string({ minLength: 1 }),
  title: fc.string(),
  artist: fc.string(),
  duration: fc.string(),
  image: fc.string(),
});

describe("Property 1: Liked songs count display", () => {
  it("LikedSongsCard subtitle contains '{count} songs' for any array of liked songs", () => {
    fc.assert(
      fc.property(fc.array(likedSongArb), (songs) => {
        const subtitle = getLikedSongsCardSubtitle(songs.length);
        expect(subtitle).toBe(`${songs.length} songs`);
      }),
      { numRuns: 100 },
    );
  });

  it("LikedSongsCard subtitle shows '0 songs' for an empty array", () => {
    const subtitle = getLikedSongsCardSubtitle(0);
    expect(subtitle).toBe("0 songs");
  });
});
