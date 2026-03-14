# Design Document — Music Player UI Overhaul

## Overview

This overhaul builds out four currently stub/incomplete pages (Search, Library, Profile, SongPlay) and fixes core player functionality (repeat, shuffle, volume) in the Beats Music Next.js app. The work is purely front-end: no new backend routes are needed. All new UI consumes the existing `/api/saavn` proxy and Firebase Auth already wired in the app.

The guiding principle is minimal new abstractions — reuse existing components (`TopGlobalSongs`, `YourPlayLists`, `RecentPlayed`, `SongPlayer`, `useDebounce`, `useAuth`) and extend them where needed rather than replacing them.

---

## Architecture

The app is a Next.js 14 App Router project with client components for all interactive pages. State is local (React `useState`/`useEffect`) — there is no global state manager. Firebase Auth provides the user object via `AuthProvider` / `useAuth`. Music data comes from the JioSaavn proxy (`/api/saavn/search`, `/api/saavn/songs`).

```
src/
  app/
    searchSong/page.tsx      ← full rebuild (Req 1, 2)
    library/page.tsx         ← new page (Req 3)
    profile/page.tsx         ← new page (Req 4)
    songPlay/page.tsx        ← layout redesign (Req 5, 6)
  components/
    SongPlayer.tsx           ← repeat/shuffle/volume fixes (Req 7, 8, 9)
    layout/
      SideBar.tsx            ← route wiring (Req 10)
      MobileNavBar.tsx       ← already wired; verify (Req 10)
  hooks/
    useAudioPlayer.ts        ← extend repeat states (Req 7)
```

### Data Flow

```
User interaction
  → page component (local state)
    → jioSaavnApi.ts (fetch via /api/saavn proxy)
      → SaavnSong[] response
        → mapped to display types (TopSong, etc.)
          → child components render
```

Liked songs and playlists are stored in `localStorage` (keyed by Firebase UID) since there is no backend persistence layer. This matches the existing pattern used by the playlist feature.

---

## Components and Interfaces

### 1. SearchSong Page (`src/app/searchSong/page.tsx`)

Full rebuild of the current stub. Manages its own search state.

**Local state:**

- `query: string` — raw input value
- `debouncedQuery: string` — via `useDebounce(query, 400)`
- `results: SaavnSong[]`
- `isLoading: boolean`
- `error: string | null`
- `activeGenre: string | null`

**Genre chips** (static list, no API call):

```ts
const GENRES = [
  "Pop",
  "Hip-Hop",
  "Rock",
  "Electronic",
  "Chill",
  "Workout",
  "Jazz",
  "R&B",
];
```

When a genre chip is clicked, it sets `query` to the genre name, which triggers the debounce → search flow naturally.

**Search trigger:** `useEffect` on `debouncedQuery` — calls `searchSongs(debouncedQuery, 20)` when non-empty; clears results when empty.

**Song card:** cover image (`<img>`), title, artist, duration. Clicking navigates to `/songPlay?id={song.id}`.

---

### 2. Library Page (`src/app/library/page.tsx`) — new file

**Local state:**

- `likedSongs: LikedSong[]` — loaded from `localStorage` on mount
- `playlists: Playlist[]` — loaded from `localStorage` on mount

```ts
type LikedSong = {
  id: string;
  title: string;
  artist: string;
  duration: string;
  image: string;
};
```

Reuses `YourPlayLists` component for the playlists section. Liked songs rendered as a simple list (same row style as `RecentPlayed`). Auth guard: redirect to `/login` if no user.

---

### 3. Profile Page (`src/app/profile/page.tsx`) — new file

Reads `user` from `useAuth()`. Displays `displayName`, `email`, `photoURL` (falls back to initials avatar). Stats (songs played, playlists count) read from `localStorage`. Logout calls `auth.signOut()` then `router.push("/login")`.

---

### 4. SongPlay Page — Layout Redesign

Remove the two info cards below `SongPlayer` and the "Active Track" banner. Replace the right column with a `QueuePanel` component.

**New `QueuePanel` component** (`src/components/QueuePanel.tsx`):

```ts
type QueuePanelProps = {
  songs: TopSong[];
  currentSongId: string | null;
  loadingSongId: string | null;
  onSelect: (song: TopSong) => void;
};
```

- Scrollable `<div>` with `overflow-y-auto`
- "Up Next" heading
- Each row: cover image (32×32), title, artist, duration
- Currently playing row highlighted with `text-cyan-400` border-left accent
- Loading row shows a small spinner

`TopGlobalSongs` is removed from `SongPlay` page only; the component itself is kept for reuse on the home page.

---

### 5. SongPlayer — Repeat / Shuffle / Volume

**Repeat (3-state):**

Current type: `"off" | "one"` → extend to `"off" | "all" | "one"`.

Cycle: `off → all → one → off`.

Visual: `off` = muted icon, `all` = cyan icon, `one` = cyan icon + small `"1"` badge.

`onEnded` logic:

- `"one"` → seek to 0 and replay
- `"all"` → call `onNext()` (queue wraps around in the page)
- `"off"` → call `onNext()` only if not last; else stop

**Shuffle:**

Currently shuffle state exists but has no effect on next-song selection. The actual shuffle logic lives in the page (`handleNext`), not in `SongPlayer`. `SongPlayer` exposes `shuffle` prop/state and the page reads it to decide next song.

Design: `SongPlayer` keeps `shuffle: boolean` state and exposes it via an `onShuffleChange` callback so the parent page can implement shuffle-aware `handleNext`.

**Volume (always visible):**

Remove the toggle-to-show pattern. Replace with an always-visible inline slider next to the volume icon. Clicking the icon toggles mute (stores previous volume in a ref, restores on un-mute).

```ts
const prevVolumeRef = useRef(0.8);

function toggleMute() {
  if (volume > 0) {
    prevVolumeRef.current = volume;
    setVolume(0);
  } else {
    setVolume(prevVolumeRef.current);
  }
}
```

---

### 6. Sidebar Route Wiring

`MusicNoteIcon` → `go("/library")` with `isActive("/library")` cyan highlight.  
`UserIcon` → `go("/profile")` with `isActive("/profile")` cyan highlight.

`MobileNavBar` already has `/library` and `/profile` wired — verify and confirm no changes needed.

---

## Data Models

### SaavnSong (existing — `src/services/jioSaavnApi.ts`)

```ts
interface SaavnSong {
  id: string;
  name: string;
  duration: number;          // seconds
  primaryArtists: string;
  image: { quality: string; link: string }[];
  downloadUrl: { quality: string; link: string }[];
  album: { id: string; name: string; url: string };
  year: string;
  releaseDate: string;
  label: string;
  artists: { id: string; name: string; role: string; image: ... }[];
}
```

### LikedSong (new — localStorage)

```ts
type LikedSong = {
  id: string;
  title: string;
  artist: string;
  duration: string; // formatted "m:ss"
  image: string; // URL
};
```

Stored at `localStorage.getItem(`liked\_${user.uid}`)` as JSON array.

### Playlist (existing — `YourPlayLists`)

```ts
type Playlist = {
  id: number;
  name: string;
  description?: string;
};
```

Stored at `localStorage.getItem(`playlists\_${user.uid}`)` as JSON array.

### RepeatMode (extended)

```ts
type RepeatMode = "off" | "all" | "one";
```

### QueueSong (alias of TopSong)

```ts
type TopSong = {
  id: string | number;
  title: string;
  artist: string;
  duration: string;
  image: string;
  isFavorite?: boolean;
};
```

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Debounce delays search

_For any_ sequence of rapid keystrokes typed within a 400 ms window, the search function should be called at most once — after the typing stops — not once per keystroke.

**Validates: Requirements 1.2**

---

### Property 2: Empty/whitespace query produces no search call

_For any_ input string composed entirely of whitespace characters (or the empty string), the search API should not be called and the results list should remain empty.

**Validates: Requirements 1.3, 1.5**

---

### Property 3: Genre chip populates query and triggers search

_For any_ genre chip label from the predefined list, clicking it should set the search input value to that label and produce a non-empty results list (assuming the API returns results for that query).

**Validates: Requirements 2.2**

---

### Property 4: Liked song round-trip persistence

_For any_ song that is marked as liked, serializing it to localStorage and then deserializing it should produce an object equal to the original.

**Validates: Requirements 3.2**

---

### Property 5: Repeat state machine cycle

_For any_ starting repeat state, clicking the repeat button three times should return to the original state (`off → all → one → off`).

**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

---

### Property 6: Repeat-one restarts on end

_For any_ song, when repeat mode is `one` and the song ends, the playback position should reset to 0 and the song should continue playing.

**Validates: Requirements 7.6**

---

### Property 7: Repeat-all wraps queue

_For any_ queue of songs, when repeat mode is `all` and the last song ends, the next song selected should be the first song in the queue.

**Validates: Requirements 7.5**

---

### Property 8: Shuffle selects different song

_For any_ queue with at least two songs, when shuffle is enabled and `handleNext` is called, the selected next song should not be the currently playing song.

**Validates: Requirements 8.1**

---

### Property 9: Sequential order without shuffle

_For any_ queue of songs, when shuffle is disabled and `handleNext` is called from position `i`, the next song should be at position `(i + 1) % queue.length`.

**Validates: Requirements 8.2**

---

### Property 10: Volume mute/restore round-trip

_For any_ non-zero volume level, toggling mute and then toggling mute again should restore the volume to its original value.

**Validates: Requirements 9.2**

---

### Property 11: Queue panel reflects current song

_For any_ queue and any currently playing song ID, the queue panel should highlight exactly one row — the row whose ID matches the current song ID.

**Validates: Requirements 5.6, 6.1**

---

## Error Handling

| Scenario                                      | Handling                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| JioSaavn search API error                     | Catch in `searchSongs`, set `error` state, render error message; no crash |
| Song details fetch fails                      | `currentSong` stays null; player shows "Select a Song" placeholder        |
| YouTube lookup fails                          | Falls back to Saavn preview URL (existing behavior)                       |
| localStorage unavailable (SSR / private mode) | Wrap all `localStorage` calls in try/catch; default to empty arrays       |
| User not authenticated on Library/Profile     | `useEffect` redirect to `/login` (same pattern as home/songPlay)          |
| Empty queue on next/prev                      | Guard with `if (!queue.length) return` before index math                  |

---

## Testing Strategy

### Unit Tests

Focus on pure functions and edge cases:

- `useDebounce` hook: verify delay behavior with fake timers
- `formatDuration(seconds)` utility: specific examples (0, 59, 60, 3599, 3600)
- Repeat state cycle: `off → all → one → off` transition table
- `toggleMute` logic: mute sets volume to 0, un-mute restores previous value
- Genre chip click: sets query to chip label
- Empty/whitespace query guard: `"   ".trim() === ""` check

### Property-Based Tests

Use **fast-check** (TypeScript-native PBT library, already compatible with Jest/Vitest).

Each property test runs a minimum of **100 iterations**.

Tag format: `// Feature: music-player-ui-overhaul, Property N: <property text>`

| Property                        | Test description                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| P1: Debounce delays search      | Generate N keystrokes within 400 ms; assert API called ≤ 1 time                         |
| P2: Whitespace query no-op      | `fc.string()` filtered to whitespace-only; assert `searchSongs` not called              |
| P3: Genre chip triggers search  | `fc.constantFrom(...GENRES)`; assert query equals chip label after click                |
| P4: Liked song round-trip       | `fc.record({id, title, artist, duration, image})`; serialize → deserialize → deep equal |
| P5: Repeat cycle                | `fc.constantFrom("off","all","one")`; click 3× → same state                             |
| P6: Repeat-one restarts         | Arbitrary song duration; simulate `onEnded` with repeat=`one`; assert position=0        |
| P7: Repeat-all wraps            | `fc.array(song, {minLength:2})`; last song ends with repeat=`all`; assert next=first    |
| P8: Shuffle avoids current      | `fc.array(song, {minLength:2})` + current index; assert next ≠ current                  |
| P9: Sequential next             | `fc.array(song, {minLength:1})` + index `i`; assert next = `(i+1) % len`                |
| P10: Mute round-trip            | `fc.float({min:0.01, max:1})`; mute → unmute → assert volume restored                   |
| P11: Queue highlight uniqueness | `fc.array(song, {minLength:1})` + current ID; assert exactly 1 highlighted row          |

Each property-based test maps 1:1 to a Correctness Property above and is implemented as a single test case.
