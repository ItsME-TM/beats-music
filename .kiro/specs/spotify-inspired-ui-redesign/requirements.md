# Requirements Document

## Introduction

This feature redesigns the Beats Music app UI to adopt Spotify's layout and UX patterns while preserving the existing dark theme (background `#0a0a0a`, accent `#22d3ee` cyan, `neutral-900` surfaces). The redesign moves the navigation from a right-side icon-only sidebar to a left sidebar with icon + label pairs, introduces a persistent bottom player bar visible across all authenticated pages, and updates content sections with Spotify-style card grids, hover effects, and "See all" section headers. The app is built on Next.js 14 App Router with TypeScript and Tailwind CSS.

## Glossary

- **App**: The Beats Music Next.js 14 application.
- **LeftSidebar**: The new fixed left-side navigation panel replacing the current right-side `SideBar` component, visible on `md+` breakpoints.
- **MobileNav**: The existing bottom navigation bar rendered on mobile (below `md` breakpoint), to be updated with Spotify-style labels.
- **BottomPlayerBar**: A new persistent mini-player component fixed at the bottom of the viewport on all authenticated pages, always visible regardless of the current route.
- **SongPlayer**: The existing full-featured player component rendered on `/songPlay`.
- **ContentArea**: The main scrollable region between the LeftSidebar and the right edge of the viewport.
- **SongCard**: A card component displaying album art, song title, and artist name with a hover play-button overlay.
- **SectionHeader**: A row containing a section title and an optional "See all" link.
- **QueuePanel**: The existing side panel listing upcoming songs on the `/songPlay` page.
- **Theme**: The color palette — background `#0a0a0a`, accent `#22d3ee`, surface `neutral-900` (`#171717`), text white/gray.

---

## Requirements

### Requirement 1: Left Sidebar Navigation

**User Story:** As a user on desktop, I want a left sidebar with icon and label navigation, so that I can quickly identify and switch between sections the same way I do in Spotify.

#### Acceptance Criteria

1. THE LeftSidebar SHALL be rendered as a fixed panel on the left edge of the viewport on screens `md` (768 px) and wider.
2. THE LeftSidebar SHALL display navigation items in a vertical list, each item containing an icon and a text label side by side.
3. THE LeftSidebar SHALL include navigation items for: Home (`/home`), Search (`/searchSong`), Library (`/library`), Profile (`/profile`), and Now Playing (`/songPlay`).
4. WHEN a navigation item matches the current route, THE LeftSidebar SHALL highlight that item using the accent color `#22d3ee`.
5. WHEN a navigation item is hovered, THE LeftSidebar SHALL transition the item text and icon color to white.
6. THE LeftSidebar SHALL include a logout action at the bottom of the panel, separated visually from the navigation items.
7. THE LeftSidebar SHALL use `neutral-900` (`#171717`) as its background color and a right border of `white/5` opacity.
8. THE LeftSidebar SHALL have a minimum width of 200 px and a maximum width of 240 px on desktop.
9. THE App SHALL remove the existing right-side `SideBar` component and replace it with the LeftSidebar.
10. THE ContentArea SHALL have a left margin equal to the LeftSidebar width on `md+` screens so content is not obscured.

---

### Requirement 2: Persistent Bottom Player Bar

**User Story:** As a user, I want a mini-player always visible at the bottom of the screen, so that I can see what's playing and control playback without navigating away from my current page.

#### Acceptance Criteria

1. THE BottomPlayerBar SHALL be rendered as a fixed bar at the bottom of the viewport on all authenticated pages.
2. THE BottomPlayerBar SHALL display the current song's album art (40×40 px), title, and artist name on the left side.
3. THE BottomPlayerBar SHALL display playback controls (previous, play/pause, next) in the center.
4. THE BottomPlayerBar SHALL display a progress bar spanning the full width of the bar above the controls row.
5. THE BottomPlayerBar SHALL display a volume control on the right side on `md+` screens.
6. WHEN no song is loaded, THE BottomPlayerBar SHALL display a placeholder state with greyed-out controls and the text "Nothing playing".
7. WHEN the play/pause button is pressed, THE BottomPlayerBar SHALL toggle playback of the current audio source.
8. WHEN the progress bar is scrubbed, THE BottomPlayerBar SHALL seek the audio to the selected position.
9. THE BottomPlayerBar SHALL use `neutral-900` background with a `white/10` top border and a height of 72 px on desktop and 64 px on mobile.
10. THE BottomPlayerBar SHALL share playback state with the `SongPlayer` component so both controls stay in sync.
11. THE ContentArea SHALL have bottom padding equal to the BottomPlayerBar height so content is not obscured.
12. WHEN a user navigates to `/songPlay`, THE BottomPlayerBar SHALL remain visible below the full SongPlayer.

---

### Requirement 3: Content Card Grid with Hover Effects

**User Story:** As a user browsing the home page, I want song and album cards with a play-button overlay on hover, so that I can quickly start playing a track without clicking into a detail page.

#### Acceptance Criteria

1. THE SongCard SHALL display a square album art image with `rounded-xl` corners.
2. WHEN a SongCard is hovered, THE SongCard SHALL overlay a semi-transparent dark layer and reveal a circular play button centered on the album art.
3. WHEN the play button on a SongCard is clicked, THE App SHALL begin playback of that song and update the BottomPlayerBar.
4. THE SongCard SHALL display the song title below the album art, truncated to one line, in white.
5. THE SongCard SHALL display the artist name below the title, truncated to one line, in `gray-400`.
6. THE home page grid SHALL render SongCards in a responsive grid: 2 columns on mobile, 3 on `sm`, 4 on `md`, 5 on `lg`, 6 on `xl`.
7. WHEN a SongCard image fails to load, THE SongCard SHALL display a fallback placeholder with a music note icon on a `neutral-800` background.

---

### Requirement 4: Section Headers with "See All" Links

**User Story:** As a user, I want section headers with a "See all" link next to each content section, so that I can explore more content beyond the initial grid.

#### Acceptance Criteria

1. THE SectionHeader SHALL render a section title in bold white text on the left and a "See all" link in `gray-400` on the right, on the same row.
2. WHEN the "See all" link is hovered, THE SectionHeader SHALL transition the link color to white.
3. THE home page SHALL use SectionHeaders for at least the "New Releases" and "Top Global Songs" sections.
4. WHEN the "See all" link for "New Releases" is clicked, THE App SHALL navigate to `/searchSong` with a pre-populated query.
5. WHEN the "See all" link for "Top Global Songs" is clicked, THE App SHALL navigate to `/songPlay`.

---

### Requirement 5: Main Content Area Layout

**User Story:** As a user, I want the main content area to scroll independently of the sidebar and player bar, so that I can browse content without the navigation or player moving.

#### Acceptance Criteria

1. THE ContentArea SHALL scroll vertically and independently of the LeftSidebar and BottomPlayerBar.
2. THE ContentArea SHALL have a top padding of at least 24 px and a bottom padding equal to the BottomPlayerBar height plus 16 px.
3. THE ContentArea SHALL have a left margin equal to the LeftSidebar width on `md+` screens.
4. WHILE the ContentArea is scrolled, THE LeftSidebar SHALL remain fixed and not scroll.
5. WHILE the ContentArea is scrolled, THE BottomPlayerBar SHALL remain fixed and not scroll.
6. THE ContentArea SHALL use `#0a0a0a` as its background color.

---

### Requirement 6: Mobile Navigation Update

**User Story:** As a mobile user, I want the bottom navigation bar to show icon and label pairs, so that navigation items are clearly identifiable.

#### Acceptance Criteria

1. THE MobileNav SHALL be visible only on screens below `md` (768 px).
2. THE MobileNav SHALL display five navigation items: Home, Search, Library, Profile, and Now Playing, each with an icon and a text label.
3. WHEN a MobileNav item matches the current route, THE MobileNav SHALL highlight that item with the accent color `#22d3ee`.
4. THE MobileNav SHALL be positioned above the BottomPlayerBar when a song is playing, or at the very bottom when nothing is playing.
5. IF the BottomPlayerBar is visible on mobile, THEN THE MobileNav SHALL be rendered above it so neither component overlaps the other.

---

### Requirement 7: Global Playback State Management

**User Story:** As a user, I want playback state to persist across page navigations, so that music keeps playing when I browse to a different section.

#### Acceptance Criteria

1. THE App SHALL maintain a single global playback state (current song, isPlaying, currentTime, volume, queue) accessible to both the BottomPlayerBar and the SongPlayer.
2. WHEN a user navigates away from `/songPlay`, THE App SHALL continue audio playback without interruption.
3. WHEN a user navigates back to `/songPlay`, THE SongPlayer SHALL reflect the current playback state from the global store.
4. WHEN a SongCard play button is clicked from any page, THE App SHALL update the global playback state and begin playback.
5. THE App SHALL implement the global playback state using React Context or an equivalent client-side state mechanism compatible with Next.js 14 App Router.
6. IF the global playback state is lost (e.g., page refresh), THEN THE App SHALL reset the BottomPlayerBar to its placeholder "Nothing playing" state.

---

### Requirement 8: Theme Consistency

**User Story:** As a user, I want the redesigned UI to feel visually consistent with the existing dark/cyan theme, so that the new Spotify-inspired layout doesn't feel like a different app.

#### Acceptance Criteria

1. THE App SHALL use `#0a0a0a` as the primary background color for all pages and the ContentArea.
2. THE App SHALL use `#22d3ee` (cyan-400) exclusively as the accent color for active states, highlights, and interactive focus indicators.
3. THE App SHALL use `neutral-900` (`#171717`) as the surface color for cards, sidebars, and the BottomPlayerBar.
4. THE App SHALL use white (`#ffffff`) for primary text and `gray-400` (`#9ca3af`) for secondary text.
5. THE App SHALL apply `rounded-xl` or `rounded-2xl` border radius to all card and panel components, consistent with the existing design.
6. WHEN interactive elements (buttons, nav items, cards) receive focus via keyboard, THE App SHALL display a visible focus ring using the accent color `#22d3ee`.
