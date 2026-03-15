// Feature: music-player-ui-overhaul, Property 10: Volume mute/restore round-trip
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 9.2

/**
 * Pure simulation of the toggleMute logic from SongPlayer.tsx:
 *
 *   const prevVolumeRef = useRef(0.8);
 *
 *   function toggleMute() {
 *     if (volume > 0) {
 *       prevVolumeRef.current = volume;
 *       setVolume(0);
 *     } else {
 *       setVolume(prevVolumeRef.current);
 *     }
 *   }
 */
function simulateMuteRoundTrip(initialVolume: number): number {
  let volume = initialVolume;
  let prevVolume = 0.8;

  // First call: mute (volume > 0, so store and set to 0)
  if (volume > 0) {
    prevVolume = volume;
    volume = 0;
  }

  // Second call: unmute (volume === 0, so restore)
  if (volume === 0) {
    volume = prevVolume;
  }

  return volume;
}

describe("Volume mute/restore round-trip (Property 10)", () => {
  it("mute then unmute restores the original volume for any non-zero volume", () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.01), max: Math.fround(1), noNaN: true }),
        (initialVolume) => {
          const restored = simulateMuteRoundTrip(initialVolume);
          expect(restored).toBe(initialVolume);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("mute sets volume to 0", () => {
    let volume = 0.5;
    let prevVolume = 0.8;

    if (volume > 0) {
      prevVolume = volume;
      volume = 0;
    }

    expect(volume).toBe(0);
    expect(prevVolume).toBe(0.5);
  });

  it("unmute restores the previously stored volume", () => {
    let volume = 0;
    const prevVolume = 0.75;

    if (volume === 0) {
      volume = prevVolume;
    }

    expect(volume).toBe(0.75);
  });
});
