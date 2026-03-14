# Requirements Document

## Introduction

This feature covers a full UI and functionality overhaul of the Beats Music Next.js app. The app currently has several pages accessible via the sidebar that are either empty stubs or have incomplete functionality. The overhaul includes: building out the Search page, Library page, and Profile page with real UI and logic; redesigning the SongPlay page with a modern layout (removing the info cards below the player, replacing the side panel with a proper queue/tracklist); and fixing the audio player to support missing features like queue management, proper repeat/shuffle behavior, and a persistent mini-player. All pages must use the existing dark theme (background `#0a0a0a`, accent `#22d3ee` cyan, neutral-900 surfaces).

## Glossary

- **App**: The Beats Music Next.js application.
- **Player**: The `SongPlayer` component responsible for audio playback controls and display.
- **Queue**: The ordered list of songs to be played sequentially.
- **SongPlay_Page**: The `/songPlay` route where the main player and queue are shown.
- **Search_Page**: The `/searchSong` route for searching and discovering songs.
- **Library_Page**: The `/library` route for browsing saved playlists and liked songs.
- **Profile_Page**: The `/profile` route showing user account information and stats.
- **Sidebar**: The fixed right-side icon navigation visible on desktop (`md+`).
- **MobileNav**: The bottom navigation bar visible on mobile (`< md`).
- **JioSaavn_API**: The proxied music metadata and search API at `/api/saavn`.
- **Theme**: The app's dark color palette — background `#0a0a0a`, surface `#111`/`#0b0b0b`, accent cyan `#22d3ee`, text white/gray.

---

## Requirements

### Requirement 1: Search Page — Song Search UI

**User Story:** As a user, I want to search for songs by name or artist, so that I can quickly find and play music I like.

#### Acceptance Criteria

1. THE Search_Page SHALL render a full-page search interface with a prominent search input field.
2. WHEN the user types in the search input, THE Search_Page SHALL debounce the input by 400ms before triggering a search.
3. WHEN a debounced search query is non-empty, THE Search_Page SHALL call the JioSaavn_API search endpoint and display results as a list of song cards.
4. WHILE a search request is in progress, THE Search_Page SHALL display a loading skeleton in place of results.
5. IF the search returns no results, THEN THE Search_Page SHALL display a "No results found" message with the searched query.
6. IF the JioSaavn_API returns an error, THEN THE Search_Page SHALL display an error state message without crashing.
7. WHEN the user clicks a song result, THE Search_Page SHALL navigate to `/songPlay?id={songId}`.
8. THE Search_Page SHALL display each result with the song's cover image, title, artist name, and duration.
9. THE Search_Page SHALL use the existing Theme for all UI elements.

---

### Requirement 2: Search Page — Genre/Mood Quick Filters

**User Story:** As a user, I want to browse music by genre or mood when I haven't typed a query, so that I can discover new music easily.

#### Acceptance Criteria

1. WHILE the search input is empty, THE Search_Page SHALL display a grid of genre/mood category chips (e.g., Pop, Hip-Hop, Rock, Electronic, Chill, Workout).
2. WHEN the user clicks a genre chip, THE Search_Page SHALL populate the search input with that genre name and trigger a search.
3. THE Search_Page SHALL style active genre chips with the accent cyan color to indicate selection.

---

### Requirement 3: Library Page — Liked Songs and Playlists

**User Story:** As a user, I want a Library page where I can see my liked songs and playlists, so that I can access my saved music in one place.

#### Acceptance Criteria

1. THE Library_Page SHALL render at the `/library` route and be accessible from the Sidebar and MobileNav.
2. THE Library_Page SHALL display a "Liked Songs" section listing songs the user has marked as favorite.
3. THE Library_Page SHALL display a "Your Playlists" section listing user-created playlists.
4. WHEN the Library_Page has no liked songs, THE Library_Page SHALL display an empty state with a prompt to like songs.
5. WHEN the Library_Page has no playlists, THE Library_Page SHALL display an empty state with a prompt to create a playlist.
6. WHEN the user clicks a song in the Liked Songs list, THE Library_Page SHALL navigate to `/songPlay?id={songId}`.
7. THE Library_Page SHALL use the existing Theme for all UI elements.

---

### Requirement 4: Profile Page — User Info Display

**User Story:** As a user, I want a Profile page showing my account details and listening stats, so that I can see my activity in the app.

#### Acceptance Criteria

1. THE Profile_Page SHALL render at the `/profile` route and be accessible from the Sidebar and MobileNav.
2. THE Profile_Page SHALL display the authenticated user's display name and email address.
3. THE Profile_Page SHALL display a placeholder avatar or the user's photo URL if available from Firebase Auth.
4. THE Profile_Page SHALL display listening stats: total songs played count and total playlists count (using locally tracked data or static placeholders if no backend tracking exists).
5. THE Profile_Page SHALL include a logout button that signs the user out via Firebase Auth and redirects to `/login`.
6. IF the user is not authenticated, THEN THE Profile_Page SHALL redirect to `/login`.
7. THE Profile_Page SHALL use the existing Theme for all UI elements.

---

### Requirement 5: SongPlay Page — Redesigned Layout

**User Story:** As a user, I want the SongPlay page to have a clean, modern layout without redundant info cards below the player, so that the interface feels focused and uncluttered.

#### Acceptance Criteria

1. THE SongPlay_Page SHALL remove the two info cards ("Now Playing" and "Queue Summary") currently rendered below the SongPlayer component.
2. THE SongPlay_Page SHALL display the Player on the left column occupying the majority of the vertical space.
3. THE SongPlay_Page SHALL display a Queue/Tracklist panel on the right column showing the list of upcoming songs.
4. THE Queue panel SHALL show each song's cover image, title, artist, and duration.
5. WHEN the user clicks a song in the Queue panel, THE SongPlay_Page SHALL load and play that song.
6. THE Queue panel SHALL visually highlight the currently playing song with the accent cyan color.
7. THE SongPlay_Page SHALL remove the "Active Track" banner card currently shown above the TopGlobalSongs list on the right column.

---

### Requirement 6: SongPlay Page — Modern Queue Panel

**User Story:** As a user, I want the right-side panel on the SongPlay page to show a proper scrollable queue, so that I can see what's coming up and navigate the tracklist.

#### Acceptance Criteria

1. THE Queue panel SHALL be scrollable and display all songs in the current Queue.
2. THE Queue panel SHALL show a "Up Next" heading above the list.
3. WHILE a song is loading, THE Queue panel SHALL show a loading indicator on that song's row.
4. THE Queue panel SHALL use compact song rows consistent with the existing Theme.
5. THE Queue panel SHALL replace the existing `TopGlobalSongs` component usage on the SongPlay_Page (the TopGlobalSongs component itself is kept for reuse elsewhere).

---

### Requirement 7: Player — Repeat Mode Enhancement

**User Story:** As a user, I want the repeat button to cycle through off, repeat-all, and repeat-one modes, so that I have full control over playback looping.

#### Acceptance Criteria

1. THE Player SHALL support three repeat states: `off`, `all`, and `one`.
2. WHEN the repeat button is clicked while in `off` state, THE Player SHALL transition to `all` state.
3. WHEN the repeat button is clicked while in `all` state, THE Player SHALL transition to `one` state.
4. WHEN the repeat button is clicked while in `one` state, THE Player SHALL transition to `off` state.
5. WHEN repeat is `all` and the last song in the Queue ends, THE Player SHALL play the first song in the Queue.
6. WHEN repeat is `one` and the current song ends, THE Player SHALL restart the current song from the beginning.
7. WHEN repeat is `off` and the last song ends, THE Player SHALL stop playback.
8. THE Player SHALL visually distinguish the three repeat states: `off` uses muted color, `all` uses accent cyan, `one` uses accent cyan with a "1" badge overlay.

---

### Requirement 8: Player — Shuffle Mode

**User Story:** As a user, I want shuffle mode to actually randomize the play order, so that I get a varied listening experience.

#### Acceptance Criteria

1. WHEN shuffle is enabled and the next song is triggered, THE Player SHALL select a random song from the Queue that is not the currently playing song.
2. WHEN shuffle is disabled, THE Player SHALL play songs in sequential Queue order.
3. THE Player SHALL visually indicate shuffle active state with the accent cyan color on the shuffle button.

---

### Requirement 9: Player — Volume Control Accessibility

**User Story:** As a user, I want the volume control to always be accessible without extra clicks, so that I can quickly adjust audio levels.

#### Acceptance Criteria

1. THE Player SHALL display the volume slider inline next to the volume icon without requiring a toggle click to reveal it.
2. WHEN the volume icon is clicked, THE Player SHALL toggle mute (volume 0) and restore the previous volume level.
3. THE Player SHALL reflect the current volume level visually on the slider at all times.

---

### Requirement 10: Sidebar and MobileNav — Route Wiring

**User Story:** As a user, I want all sidebar and mobile nav icons to navigate to their respective pages, so that I can access every section of the app.

#### Acceptance Criteria

1. THE Sidebar SHALL wire the MusicNote icon to navigate to `/library`.
2. THE Sidebar SHALL wire the User icon to navigate to `/profile`.
3. THE MobileNav SHALL wire the Library item to navigate to `/library`.
4. THE MobileNav SHALL wire the Profile item to navigate to `/profile`.
5. THE Sidebar SHALL apply the active cyan highlight to the MusicNote icon when the current path starts with `/library`.
6. THE Sidebar SHALL apply the active cyan highlight to the User icon when the current path starts with `/profile`.

---

### Requirement 11: Theme Consistency

**User Story:** As a user, I want all new and updated pages to visually match the existing app design, so that the experience feels cohesive.

#### Acceptance Criteria

1. THE App SHALL use background colors `#0a0a0a` / `#0b0b0b` / `#111` for page and surface backgrounds on all new pages.
2. THE App SHALL use `#22d3ee` (cyan-400) as the primary accent color for active states, highlights, and interactive elements on all new pages.
3. THE App SHALL use white and gray-400 for primary and secondary text on all new pages.
4. THE App SHALL use `rounded-xl` or `rounded-2xl` border radius for card surfaces on all new pages.
5. WHERE a page requires a loading state, THE App SHALL use skeleton loaders consistent with the existing `HomeSkeleton` style.
