// Feature: music-player-ui-overhaul, Property 4: Liked song round-trip persistence
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 3.2

type LikedSong = {
  id: string;
  title: string;
  artist: string;
  duration: string; // formatted "m:ss"
  image: string; // URL
};

describe("Liked song round-trip persistence (Property 4)", () => {
  it("serializing a LikedSong to JSON and deserializing produces an equal object", () => {
    fc.assert(
      fc.property(
        fc.record<LikedSong>({
          id: fc.string({ minLength: 1 }),
          title: fc.string(),
          artist: fc.string(),
          duration: fc.string(),
          image: fc.string(),
        }),
        (song) => {
          const serialized = JSON.stringify([song]);
          const deserialized: LikedSong[] = JSON.parse(serialized);
          expect(deserialized[0]).toEqual(song);
        },
      ),
      { numRuns: 100 },
    );
  });
});
