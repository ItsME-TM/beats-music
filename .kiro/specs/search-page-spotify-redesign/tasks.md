# Implementation Plan: Search Page Spotify Redesign

## Overview

Single-file rewrite of `src/app/searchSong/page.tsx` to introduce colorful gradient Category Cards, a "Browse all" section, a split Top Result + Songs List layout, polished loading/empty/error states, and new property-based tests — while preserving all existing search behaviour.

## Tasks

- [x] 1. Refactor `src/app/searchSong/page.tsx` with new constants and pure utilities
  - Replace the plain `GENRES` array with a `GENRE_GRADIENTS` record mapping each genre to its Tailwind gradient pair (`from-pink-500 to-rose-400`, etc.)
  - Extract `decodeEntities(str: string): string` as a named function (currently inlined)
  - Keep `formatDuration` unchanged
  - _Requirements: 1.2, 1.3, 7.5, 8.2_

- [x] 2. Implement `CategoryCard` and `BrowseSection` components
  - [x] 2.1 Implement `CategoryCard` local component
    - Rounded card with `bg-gradient-to-br` using the genre's gradient, min-height 100px, bold white genre label
    - Hover: `hover:scale-105 hover:brightness-110 transition-transform` (≤110% scale / ≤10% brightness)
    - On click calls `onClick(genre)`
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 8.2, 8.4_

  - [x] 2.2 Implement `BrowseSection` local component
    - "Browse all" heading: `text-xl font-bold text-white` (≥20px, white)
    - Responsive grid: `grid grid-cols-2 lg:grid-cols-4 gap-4`
    - Renders one `CategoryCard` per entry in `GENRE_GRADIENTS`
    - _Requirements: 1.1, 1.7, 2.1, 2.2_

  - [x] 2.3 Write property test for CategoryCard click (Property 2)
    - **Property 2: Category card click populates query**
    - **Validates: Requirements 1.6**
    - File: `src/__tests__/genreChipPopulatesQuery.test.ts` (update existing test to cover `CategoryCard`)

  - [x] 2.4 Write property test for all genres rendered (Property 3)
    - **Property 3: All genres have a card**
    - **Validates: Requirements 1.2, 1.3**
    - New test in `src/__tests__/` asserting card count === `Object.keys(GENRE_GRADIENTS).length` (≥8)

- [x] 3. Implement `TopResultCard` component
  - Large dark card (`bg-neutral-900 rounded-2xl p-6`)
  - Cover image ≥80×80px via `getSongImage`, song name decoded via `decodeEntities`, primary artist, "Song" type badge
  - Clicking navigates to `/songPlay?id={song.id}`
  - _Requirements: 3.1, 3.2, 3.3, 3.7, 8.3_

- [x] 4. Implement `SongRow` component and `SongsList` section
  - [x] 4.1 Implement `SongRow` local component
    - 50×50px cover image, decoded song name, primary artist, formatted duration
    - `hover:bg-neutral-800 transition-colors`
    - Clicking navigates to `/songPlay?id={song.id}`
    - _Requirements: 3.8, 3.9, 8.5_

  - [x] 4.2 Write property test for song navigation (Property 5)
    - **Property 5: Song navigation round trip**
    - **Validates: Requirements 3.7, 3.8**
    - File: `src/__tests__/` — generate arbitrary `SaavnSong`, simulate click, assert `router.push` called with `/songPlay?id={song.id}`

- [x] 5. Implement `SplitLayoutSkeleton` component
  - Two-column skeleton mirroring the results layout: one large block left (`w-full h-48 rounded-2xl`), multiple row-shaped blocks right
  - Uses existing `Skeleton` component with `animate-pulse`
  - _Requirements: 5.1, 5.2_

- [x] 6. Wire split results layout into `SearchSongPage`
  - Replace the old flat results list with the two-column layout:
    - Desktop (≥768px): `grid grid-cols-[1fr_2fr] gap-6` — `TopResultCard` left, `SongsList` (results starting at index 1) right
    - Mobile: single column, `TopResultCard` above `SongsList`
  - Add "Top result" and "Songs" section labels (`text-lg font-bold text-white`, ≥18px)
  - Replace `SearchSkeleton` with `SplitLayoutSkeleton` when `isLoading` is true
  - _Requirements: 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 5.3_

  - [x] 6.1 Write property test for top result is first (Property 4)
    - **Property 4: Top result card shows first result**
    - **Validates: Requirements 3.1, 3.5**
    - Generate arbitrary `SaavnSong[]` (length ≥1); assert `TopResultCard` receives `results[0]`

  - [x] 6.2 Write property test for loading hides content (Property 10)
    - **Property 10: Loading state hides results and browse section**
    - **Validates: Requirements 5.3**
    - File: `src/__tests__/` — set `isLoading=true`, assert neither results nor `BrowseSection` are rendered

- [x] 7. Wire `BrowseSection` visibility and empty/error states into `SearchSongPage`
  - Show `BrowseSection` when `query.trim() === ""` (replaces old genre chips)
  - Empty state: centered message containing the trimmed query text, `text-sm` (≥14px)
  - Error state: red text (`text-red-400`)
  - Clearing input after error/empty resets to `BrowseSection`
  - _Requirements: 1.1, 2.1, 6.1, 6.2, 6.3, 6.4_

  - [x] 7.1 Write property test for browse section visibility (Property 1)
    - **Property 1: Browse section shown iff query is empty**
    - **Validates: Requirements 1.1, 2.1, 7.3**
    - File: `src/__tests__/` — generate arbitrary strings; assert `BrowseSection` visible ↔ trimmed string is empty

  - [x] 7.2 Write property test for empty state shows query (Property 9)
    - **Property 9: Empty state shows searched query**
    - **Validates: Requirements 6.1**
    - File: `src/__tests__/` — generate non-empty query strings with empty results; assert message contains exact trimmed query

- [x] 8. Verify preserved search behaviour
  - Confirm `useDebounce(query, 400)` still drives all fetches (no change needed, just verify wiring)
  - Confirm `searchSongs(trimmed, 20)` call is unchanged
  - Confirm cancellation via `cancelled` flag is intact
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 8.1 Write property test for whitespace query no-op (Property 6)
    - **Property 6: Whitespace query does not trigger search**
    - **Validates: Requirements 7.3**
    - File: `src/__tests__/whitespaceQueryNoOp.test.ts` (update existing test if needed)

  - [x] 8.2 Write property test for debounce delays search (Property 7)
    - **Property 7: Debounce delays search**
    - **Validates: Requirements 7.1, 7.2**
    - File: `src/__tests__/debounceDelaysSearch.test.ts` (update existing test if needed)

  - [x] 8.3 Write property test for HTML entity decoding (Property 8)
    - **Property 8: HTML entity decoding**
    - **Validates: Requirements 7.5**
    - File: `src/__tests__/` — generate strings with random entity insertions; assert rendered text contains no raw entity strings

- [x] 9. Final checkpoint — Ensure all tests pass
  - Run `npx vitest --run` and confirm all existing and new tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- All components are co-located in `src/app/searchSong/page.tsx` — no new files needed for implementation
- Property tests live in `src/__tests__/` alongside existing tests
- The data layer (`searchSongs`, `useDebounce`, `getSongImage`) is untouched
