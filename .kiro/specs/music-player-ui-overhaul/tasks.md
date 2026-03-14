# Implementation Plan: Music Player UI Overhaul

## Overview

Incrementally build out the four stub/incomplete pages (Search, Library, Profile, SongPlay) and fix core player functionality (repeat, shuffle, volume) in the Beats Music Next.js app. All work is front-end TypeScript/React using existing components and the `/api/saavn` proxy.

## Tasks

- [x] 1. Fix SongPlayer repeat, shuffle, and volume controls
  - [x] 1.1 Extend repeat state from `"off" | "one"` to `"off" | "all" | "one"` in `SongPlayer.tsx` and `useAudioPlayer.ts`
    - Change the `repeat` type and update the cycle button: `off → all → one → off`
    - Update `onEnded` handler: `"one"` seeks to 0 and replays; `"all"` calls `onNext()`; `"off"` calls `onNext()` only if not last, else stops
    - Update visual: `off` = muted icon, `all` = cyan icon, `one` = cyan icon + small `"1"` badge overlay
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

  - [x] 1.2 Write property test for repeat state machine cycle (Property 5)
    - **Property 5: Repeat state machine cycle**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
    - Use `fc.constantFrom("off", "all", "one")` — clicking repeat 3× returns to original state

  - [x] 1.3 Write property test for repeat-one restart (Property 6)
    - **Property 6: Repeat-one restarts on end**
    - **Validates: Requirements 7.6**
    - Simulate `onEnded` with repeat=`one`; assert playback position resets to 0

  - [x] 1.4 Write property test for repeat-all queue wrap (Property 7)
    - **Property 7: Repeat-all wraps queue**
    - **Validates: Requirements 7.5**
    - `fc.array(song, {minLength:2})`; last song ends with repeat=`all`; assert next song is first in queue

  - [x] 1.5 Add `onShuffleChange` callback to `SongPlayer` and expose shuffle state to parent
    - `SongPlayer` keeps `shuffle: boolean` state internally and calls `onShuffleChange(shuffle)` when toggled
    - Update `SongPlayerProps` type to include `onShuffleChange?: (shuffle: boolean) => void`
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 1.6 Replace toggle-to-show volume with always-visible inline slider in `SongPlayer.tsx`
    - Remove `showVolume` state and the conditional width animation
    - Render volume icon + slider side-by-side at all times
    - Clicking the icon calls `toggleMute()` using `prevVolumeRef` to store/restore previous volume
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 1.7 Write property test for volume mute/restore round-trip (Property 10)
    - **Property 10: Volume mute/restore round-trip**
    - **Validates: Requirements 9.2**
    - `fc.float({min:0.01, max:1})`; mute → unmute → assert volume restored to original

- [x] 2. Checkpoint — Ensure all player tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Rebuild Search page (`src/app/searchSong/page.tsx`)
  - [x] 3.1 Implement full search UI with debounced input and results list
    - Replace the stub with a full-page layout: prominent search `<input>`, results list below
    - Use `useDebounce(query, 400)` from `src/hooks/useDebounce.ts`
    - `useEffect` on `debouncedQuery`: call `searchSongs(debouncedQuery, 20)` when non-empty; clear results when empty
    - Show loading skeleton (consistent with `HomeSkeleton`) while fetching
    - Show "No results found for '{query}'" when results array is empty after a completed fetch
    - Show error message (no crash) when API throws
    - Each result card: cover image, title, artist, duration; clicking navigates to `/songPlay?id={song.id}`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

  - [x] 3.2 Write property test for debounce delays search (Property 1)
    - **Property 1: Debounce delays search**
    - **Validates: Requirements 1.2**
    - Generate N keystrokes within 400 ms window using fake timers; assert `searchSongs` called ≤ 1 time

  - [x] 3.3 Write property test for empty/whitespace query no-op (Property 2)
    - **Property 2: Empty/whitespace query produces no search call**
    - **Validates: Requirements 1.3, 1.5**
    - `fc.string()` filtered to whitespace-only inputs; assert `searchSongs` never called

  - [x] 3.4 Add genre/mood chip grid shown when query is empty
    - Render `GENRES` chip grid (`["Pop","Hip-Hop","Rock","Electronic","Chill","Workout","Jazz","R&B"]`) when `query === ""`
    - Clicking a chip sets `query` to the chip label (debounce → search fires naturally)
    - Active chip (matching current `query`) styled with `text-cyan-400` border/background
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.5 Write property test for genre chip populates query (Property 3)
    - **Property 3: Genre chip populates query and triggers search**
    - **Validates: Requirements 2.2**
    - `fc.constantFrom(...GENRES)`; assert query equals chip label after click

- [x] 4. Checkpoint — Ensure all search tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Create Library page (`src/app/library/page.tsx`)
  - [x] 5.1 Create the Library page with liked songs and playlists sections
    - New file at `src/app/library/page.tsx`
    - Auth guard: `useEffect` redirect to `/login` if no user (same pattern as home/songPlay)
    - Load `likedSongs` from `localStorage.getItem(`liked\_${user.uid}`)` on mount; default to `[]`
    - Load `playlists` from `localStorage.getItem(`playlists\_${user.uid}`)` on mount; default to `[]`
    - Render "Liked Songs" section: list rows with cover image, title, artist, duration; clicking navigates to `/songPlay?id={song.id}`
    - Render "Your Playlists" section: reuse `YourPlayLists` component
    - Empty state for liked songs: prompt to like songs
    - Empty state for playlists: prompt to create a playlist
    - Wrap all `localStorage` calls in try/catch
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 5.2 Write property test for liked song round-trip persistence (Property 4)
    - **Property 4: Liked song round-trip persistence**
    - **Validates: Requirements 3.2**
    - `fc.record({id, title, artist, duration, image})`; serialize to JSON → deserialize → assert deep equal

- [x] 6. Create Profile page (`src/app/profile/page.tsx`)
  - [x] 6.1 Implement Profile page with user info, stats, and logout
    - New file at `src/app/profile/page.tsx`
    - Auth guard: redirect to `/login` if no user
    - Display `user.displayName`, `user.email`, and avatar (`user.photoURL` or initials fallback)
    - Display stats: total songs played and playlists count read from `localStorage`
    - Logout button: calls `auth.signOut()` then `router.push("/login")`
    - Apply Theme: `#0a0a0a` background, `#22d3ee` accent, `rounded-2xl` cards
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 7. Redesign SongPlay page layout and add QueuePanel
  - [x] 7.1 Create `QueuePanel` component (`src/components/QueuePanel.tsx`)
    - Props: `songs: TopSong[]`, `currentSongId: string | null`, `loadingSongId: string | null`, `onSelect: (song: TopSong) => void`
    - Scrollable `<div>` with `overflow-y-auto`, "Up Next" heading
    - Each row: 32×32 cover image, title, artist, duration
    - Currently playing row: left border accent `border-l-2 border-cyan-400`, `text-cyan-400` title
    - Loading row: small spinner indicator
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4_

  - [x] 7.2 Write property test for queue panel highlights exactly one row (Property 11)
    - **Property 11: Queue panel reflects current song**
    - **Validates: Requirements 5.6, 6.1**
    - `fc.array(song, {minLength:1})` + current ID; assert exactly 1 row has the active highlight class

  - [x] 7.3 Redesign `src/app/songPlay/page.tsx` layout
    - Remove the two info cards (`Now Playing`, `Queue Summary`) below `SongPlayer`
    - Remove the "Active Track" banner card in the right column
    - Replace `TopGlobalSongs` in the right column with `QueuePanel`
    - Pass `topSongs`, `songId`, and `isAudioLoading ? songId : null` as `loadingSongId` to `QueuePanel`
    - Update `handleNext` to respect shuffle: if `shuffle` is true, pick a random song ≠ current; otherwise sequential
    - Wire `onShuffleChange` from `SongPlayer` to update local `shuffle` state in the page
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.7, 6.5, 8.1, 8.2_

  - [x] 7.4 Write property test for shuffle avoids current song (Property 8)
    - **Property 8: Shuffle selects different song**
    - **Validates: Requirements 8.1**
    - `fc.array(song, {minLength:2})` + current index; assert `handleNext` result ≠ current song

  - [x] 7.5 Write property test for sequential next without shuffle (Property 9)
    - **Property 9: Sequential order without shuffle**
    - **Validates: Requirements 8.2**
    - `fc.array(song, {minLength:1})` + index `i`; assert next = `(i+1) % queue.length`

- [x] 8. Checkpoint — Ensure all SongPlay and queue tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Wire Sidebar routes for Library and Profile
  - [x] 9.1 Update `SideBar.tsx` to wire `MusicNoteIcon` → `/library` and `UserIcon` → `/profile`
    - Add `onClick={() => go("/library")}` and active cyan class when `isActive("/library")` to `MusicNoteIcon`
    - Add `onClick={() => go("/profile")}` and active cyan class when `isActive("/profile")` to `UserIcon`
    - `MobileNavBar` already has `/library` and `/profile` wired — no changes needed
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **fast-check** (`fc`) — install with `npm install --save-dev fast-check` if not present
- Each property test maps 1:1 to a Correctness Property in `design.md`
- `localStorage` calls must always be wrapped in try/catch for SSR/private-mode safety
- `TopGlobalSongs` component is kept intact — only removed from `SongPlay` page, still used on home
