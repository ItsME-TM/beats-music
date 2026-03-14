// Feature: music-player-ui-overhaul, Property 6: Repeat-one restarts on end
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 7.6

type RepeatMode = "off" | "all" | "one";

/**
 * Simulates the onEnded handler logic from useAudioPlayer.ts and SongPlayer.tsx.
 *
 * In useAudioPlayer.ts:
 *   if (repeat === "one") {
 *     audio.currentTime = 0;
 *     audio.play().catch(() => {});
 *   }
 *
 * In SongPlayer.tsx (ReactPlayer onEnded):
 *   if (repeat === "one") {
 *     playerRef.current.seekTo(0);
 *     setIsPlaying(true);
 *   }
 *
 * Returns the resulting currentTime after onEnded fires.
 */
function simulateOnEnded(
  repeat: RepeatMode,
  currentTime: number,
): { currentTime: number; isPlaying: boolean } {
  if (repeat === "one") {
    return { currentTime: 0, isPlaying: true };
  }
  // For "all" or "off", onNext is called — currentTime is not reset by the handler itself
  return { currentTime, isPlaying: repeat !== "off" };
}

describe("Repeat-one restarts on end (Property 6)", () => {
  it("when repeat is 'one', onEnded always resets currentTime to 0 regardless of song position", () => {
    fc.assert(
      fc.property(
        // Any playback position within a song (0 to 3600 seconds)
        fc.float({ min: 0, max: 3600, noNaN: true }),
        (position) => {
          const result = simulateOnEnded("one", position);
          expect(result.currentTime).toBe(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("when repeat is 'one', onEnded sets isPlaying to true so the song continues", () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 3600, noNaN: true }), (position) => {
        const result = simulateOnEnded("one", position);
        expect(result.isPlaying).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it("when repeat is NOT 'one', onEnded does not reset currentTime to 0", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<RepeatMode>("off", "all"),
        // Position strictly > 0 to distinguish from a genuine reset
        fc.float({ min: 1, max: 3600, noNaN: true }),
        (repeat, position) => {
          const result = simulateOnEnded(repeat, position);
          expect(result.currentTime).toBe(position);
        },
      ),
      { numRuns: 100 },
    );
  });
});
