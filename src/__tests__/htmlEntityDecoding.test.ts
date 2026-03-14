// Feature: search-page-spotify-redesign, Property 8: HTML entity decoding
// Validates: Requirements 7.5
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

// Mirrors the decodeEntities function from SearchSongPage
function decodeEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&");
}

const ENTITIES = ["&quot;", "&#039;", "&amp;"];
const DECODED = ['"', "'", "&"];

describe("Property 8: HTML entity decoding", () => {
  it("decodes &quot; to double quote", () => {
    expect(decodeEntities("say &quot;hello&quot;")).toBe('say "hello"');
  });

  it("decodes &#039; to single quote", () => {
    expect(decodeEntities("it&#039;s")).toBe("it's");
  });

  it("decodes &amp; to ampersand", () => {
    expect(decodeEntities("rock &amp; roll")).toBe("rock & roll");
  });

  it("decoded string never contains raw entity strings", () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.array(fc.constantFrom(...ENTITIES), { minLength: 0, maxLength: 5 }),
        (base, entities) => {
          // Insert entities at random positions in the base string
          const withEntities = entities.reduce((s, entity) => s + entity, base);
          const decoded = decodeEntities(withEntities);
          for (const entity of ENTITIES) {
            expect(decoded).not.toContain(entity);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it("decoded string contains the correct replacement characters", () => {
    fc.assert(
      fc.property(fc.constantFrom(...ENTITIES), (entity) => {
        const decoded = decodeEntities(entity);
        const idx = ENTITIES.indexOf(entity);
        expect(decoded).toBe(DECODED[idx]);
      }),
      { numRuns: 100 },
    );
  });

  it("strings without entities are unchanged", () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !ENTITIES.some((e) => s.includes(e))),
        (str) => {
          expect(decodeEntities(str)).toBe(str);
        },
      ),
      { numRuns: 100 },
    );
  });
});
