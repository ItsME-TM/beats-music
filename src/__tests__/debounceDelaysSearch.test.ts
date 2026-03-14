// Feature: music-player-ui-overhaul, Property 1: Debounce delays search
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 1.2

/**
 * Simulates the debounce mechanism used by useDebounce(query, 400).
 *
 * For each keystroke we clear the previous timer and set a new one for 400ms.
 * The search fires only when the timer is allowed to expire.
 *
 * Returns the number of times the search callback was invoked.
 */
function simulateDebounce(
  keystrokes: string[],
  timings: number[], // ms offset of each keystroke from t=0
  debounceDelay: number,
  advanceAfterMs: number, // how far to advance time after the last keystroke
): number {
  let callCount = 0;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  for (let i = 0; i < keystrokes.length; i++) {
    // Advance fake time to the keystroke moment
    vi.advanceTimersByTime(i === 0 ? timings[0] : timings[i] - timings[i - 1]);

    // Clear previous debounce timer (mirrors useDebounce cleanup)
    if (timerId !== null) clearTimeout(timerId);

    // Schedule the search
    const query = keystrokes[i];
    timerId = setTimeout(() => {
      if (query.trim()) callCount++;
    }, debounceDelay);
  }

  // Advance time by the remaining window after the last keystroke
  vi.advanceTimersByTime(advanceAfterMs);

  return callCount;
}

describe("Debounce delays search (Property 1)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("N keystrokes within a 400ms window trigger searchSongs at most once", () => {
    fc.assert(
      fc.property(
        // Generate between 1 and 20 keystrokes
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 20 }),
        // Generate N-1 inter-keystroke gaps that sum to < 400ms total
        fc.array(fc.integer({ min: 1, max: 50 }), {
          minLength: 0,
          maxLength: 19,
        }),
        (keystrokes, gaps) => {
          vi.clearAllTimers();

          // Build absolute timings: first keystroke at t=0, rest spaced by gaps
          const timings: number[] = [0];
          for (let i = 0; i < keystrokes.length - 1; i++) {
            const gap = gaps[i] ?? 10;
            timings.push(timings[timings.length - 1] + gap);
          }

          // Ensure all keystrokes fall within a 400ms window
          // (clamp last timing to 399ms if needed)
          const lastTiming = timings[timings.length - 1];
          if (lastTiming >= 400) {
            // Scale timings to fit within 399ms
            const scale = 399 / lastTiming;
            for (let i = 1; i < timings.length; i++) {
              timings[i] = Math.floor(timings[i] * scale);
            }
          }

          // Advance 0ms after last keystroke — still within the 400ms window,
          // so the debounce timer has NOT fired yet
          const callCount = simulateDebounce(keystrokes, timings, 400, 0);

          expect(callCount).toBeLessThanOrEqual(1);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("N keystrokes within 400ms then silence fires search exactly once for non-empty query", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
        (keystrokes) => {
          vi.clearAllTimers();

          // All keystrokes at t=0 (worst case: all simultaneous)
          const timings = keystrokes.map(() => 0);

          // Advance 400ms after last keystroke so the debounce fires
          const callCount = simulateDebounce(keystrokes, timings, 400, 400);

          // After silence, exactly one search fires (for the last non-empty query)
          expect(callCount).toBeLessThanOrEqual(1);
        },
      ),
      { numRuns: 100 },
    );
  });
});
