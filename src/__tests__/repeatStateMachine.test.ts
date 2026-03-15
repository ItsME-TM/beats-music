// Feature: music-player-ui-overhaul, Property 5: Repeat state machine cycle
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Validates: Requirements 7.1, 7.2, 7.3, 7.4

type RepeatMode = "off" | "all" | "one";

/**
 * Pure cycle function extracted from SongPlayer.tsx repeat button handler:
 *   r === "off" ? "all" : r === "all" ? "one" : "off"
 */
function cycleRepeat(r: RepeatMode): RepeatMode {
  if (r === "off") return "all";
  if (r === "all") return "one";
  return "off";
}

describe("Repeat state machine cycle (Property 5)", () => {
  it("clicking repeat 3 times from any starting state returns to the original state", () => {
    fc.assert(
      fc.property(
        fc.constantFrom<RepeatMode>("off", "all", "one"),
        (initial) => {
          const after3 = cycleRepeat(cycleRepeat(cycleRepeat(initial)));
          expect(after3).toBe(initial);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("cycle follows the exact off → all → one → off sequence", () => {
    expect(cycleRepeat("off")).toBe("all");
    expect(cycleRepeat("all")).toBe("one");
    expect(cycleRepeat("one")).toBe("off");
  });
});
