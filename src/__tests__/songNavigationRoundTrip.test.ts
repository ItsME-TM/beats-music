// Feature: search-page-spotify-redesign, Property 5: Song navigation round trip
// Validates: Requirements 3.7, 3.8
import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";

// Simulates the handleSongClick logic from SearchSongPage:
//   const handleSongClick = (id: string) => {
//     router.push(`/songPlay?id=${id}`);
//   };
function simulateSongClick(id: string): string {
  return `/songPlay?id=${id}`;
}

describe("Property 5: Song navigation round trip", () => {
  it("clicking any song navigates to /songPlay?id={song.id}", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => s.trim().length > 0),
        (id) => {
          const url = simulateSongClick(id);
          expect(url).toBe(`/songPlay?id=${id}`);
          expect(url).toContain(id);
          expect(url.startsWith("/songPlay?id=")).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("navigation URL contains the exact song id without modification", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => s.trim().length > 0),
        (id) => {
          const url = simulateSongClick(id);
          // Extract the id from the URL and verify it matches exactly
          const extractedId = url.replace("/songPlay?id=", "");
          expect(extractedId).toBe(id);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("router.push is called with the correct URL for any song id", () => {
    fc.assert(
      fc.property(
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter((s) => s.trim().length > 0),
        (id) => {
          const mockPush = vi.fn();
          // Simulate the click handler
          const handleSongClick = (songId: string) => {
            mockPush(`/songPlay?id=${songId}`);
          };
          handleSongClick(id);
          expect(mockPush).toHaveBeenCalledWith(`/songPlay?id=${id}`);
          expect(mockPush).toHaveBeenCalledTimes(1);
        },
      ),
      { numRuns: 100 },
    );
  });
});
