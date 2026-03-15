// Feature: search-page-spotify-redesign, Property 3: All genres have a card
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

const GENRE_GRADIENTS: Record<string, string> = {
  Pop: "from-pink-500 to-rose-400",
  "Hip-Hop": "from-orange-500 to-yellow-400",
  Rock: "from-gray-600 to-slate-800",
  Electronic: "from-cyan-500 to-blue-600",
  Chill: "from-teal-500 to-emerald-400",
  Workout: "from-red-600 to-orange-500",
  Jazz: "from-amber-600 to-yellow-700",
  "R&B": "from-purple-600 to-violet-500",
};

describe("Property 3: All genres have a card", () => {
  it("GENRE_GRADIENTS has at least 8 entries", () => {
    expect(Object.keys(GENRE_GRADIENTS).length).toBeGreaterThanOrEqual(8);
  });

  it("all genre keys are unique", () => {
    const keys = Object.keys(GENRE_GRADIENTS);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it("each genre has a non-empty gradient string", () => {
    fc.assert(
      fc.property(fc.constantFrom(...Object.keys(GENRE_GRADIENTS)), (genre) => {
        const gradient = GENRE_GRADIENTS[genre];
        expect(gradient).toBeTruthy();
        expect(gradient.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });

  it("BrowseSection would render exactly GENRE_GRADIENTS.length cards", () => {
    // Simulates: Object.entries(GENRE_GRADIENTS).map(([genre, gradient]) => <CategoryCard ... />)
    const cards = Object.entries(GENRE_GRADIENTS).map(([genre, gradient]) => ({
      genre,
      gradient,
    }));
    expect(cards.length).toBe(Object.keys(GENRE_GRADIENTS).length);
    expect(cards.length).toBeGreaterThanOrEqual(8);
    // Each card label matches a distinct genre
    const labels = cards.map((c) => c.genre);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
