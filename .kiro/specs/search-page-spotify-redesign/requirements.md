# Requirements Document

## Introduction

This feature redesigns the search page (`src/app/searchSong/page.tsx`) to feel modern and visually rich, inspired by Spotify's search experience. The current page is functional but sparse — plain genre chips, a flat song list, and no visual hierarchy. The redesign introduces colorful gradient category cards, a "Browse all" section, a split "Top result + songs list" layout for search results, and polished empty/loading states. All existing functionality (debounced search, JioSaavn API, song navigation) is preserved.

## Glossary

- **Search_Page**: The page at `/searchSong` that handles music search and discovery.
- **Category_Card**: A visually rich card with a gradient background color and label, representing a genre or mood category.
- **Browse_Section**: The grid of Category_Cards shown when no search query is active.
- **Top_Result_Card**: A large featured card showing the best-matching song from a search, displayed prominently on the left side of the results layout.
- **Songs_List**: The vertical list of remaining search result songs shown to the right of the Top_Result_Card.
- **Search_Input**: The text input field with debounce that triggers song search.
- **Skeleton_Loader**: Animated placeholder UI shown while search results are loading.
- **Empty_State**: The UI shown when the search query is active but returns no results.
- **Genre**: A music category label (e.g., Pop, Hip-Hop, Rock, Electronic, Chill, Workout, Jazz, R&B).

---

## Requirements

### Requirement 1: Colorful Category Cards in Browse Section

**User Story:** As a listener, I want to see visually rich genre/category cards when I haven't typed a search query, so that browsing feels engaging and I can quickly jump into a genre.

#### Acceptance Criteria

1. WHEN the Search_Input is empty, THE Search_Page SHALL display a Browse_Section containing one Category_Card per Genre.
2. THE Search_Page SHALL render at least 8 Category_Cards in the Browse_Section (Pop, Hip-Hop, Rock, Electronic, Chill, Workout, Jazz, R&B).
3. THE Category_Card SHALL display a unique gradient background color combination distinct from all other Category_Cards.
4. THE Category_Card SHALL display the Genre label as bold white text.
5. THE Category_Card SHALL have a minimum height of 100px and maintain a consistent aspect ratio across viewport sizes.
6. WHEN a user clicks a Category_Card, THE Search_Page SHALL populate the Search_Input with the corresponding Genre label and trigger a search.
7. THE Browse_Section SHALL render Category_Cards in a responsive grid with at least 2 columns on mobile and at least 4 columns on desktop viewports (≥1024px wide).

---

### Requirement 2: "Browse All" Section Header

**User Story:** As a listener, I want a clear section heading above the category grid, so that I understand the purpose of the cards below.

#### Acceptance Criteria

1. WHEN the Search_Input is empty, THE Search_Page SHALL display a "Browse all" heading immediately above the Browse_Section.
2. THE Search_Page SHALL render the "Browse all" heading in a font size of at least 20px and in white or near-white color.

---

### Requirement 3: Top Result + Songs List Split Layout

**User Story:** As a listener, I want to see the best matching song highlighted prominently alongside the full results list, so that I can immediately identify the most relevant result.

#### Acceptance Criteria

1. WHEN a search returns one or more results, THE Search_Page SHALL display a Top_Result_Card for the first result in the results array.
2. THE Top_Result_Card SHALL display the song's cover image at a minimum size of 80x80px.
3. THE Top_Result_Card SHALL display the song name, primary artist, and a "Song" type label.
4. THE Top_Result_Card SHALL occupy the left column of a two-column layout on desktop viewports (≥768px wide).
5. THE Songs_List SHALL occupy the right column of the two-column layout on desktop viewports (≥768px wide), displaying results starting from the second item in the results array.
6. WHEN the viewport is narrower than 768px, THE Search_Page SHALL stack the Top_Result_Card above the Songs_List in a single column.
7. WHEN a user clicks the Top_Result_Card, THE Search_Page SHALL navigate to `/songPlay?id={song.id}`.
8. WHEN a user clicks a song row in the Songs_List, THE Search_Page SHALL navigate to `/songPlay?id={song.id}`.
9. THE Songs_List SHALL display each song's cover image (50x50px), name, primary artist, and formatted duration (MM:SS).

---

### Requirement 4: Section Labels for Search Results

**User Story:** As a listener, I want clear labels above the "Top result" card and the songs list, so that I understand what each section represents.

#### Acceptance Criteria

1. WHEN search results are displayed, THE Search_Page SHALL render a "Top result" label above the Top_Result_Card.
2. WHEN search results are displayed, THE Search_Page SHALL render a "Songs" label above the Songs_List.
3. THE Search_Page SHALL render both section labels in a font size of at least 18px and in white or near-white color.

---

### Requirement 5: Polished Loading State

**User Story:** As a listener, I want to see a visually consistent loading skeleton while results are fetching, so that the page doesn't feel broken or empty during load.

#### Acceptance Criteria

1. WHEN a search is in progress, THE Search_Page SHALL display a Skeleton_Loader that mirrors the two-column split layout (one large skeleton block on the left, multiple row skeletons on the right).
2. THE Skeleton_Loader SHALL use an animated pulse effect consistent with the existing `Skeleton` component.
3. WHEN a search is in progress, THE Search_Page SHALL NOT display any previous search results or the Browse_Section.

---

### Requirement 6: Polished Empty and Error States

**User Story:** As a listener, I want clear, friendly feedback when my search returns nothing or fails, so that I'm not left staring at a blank screen.

#### Acceptance Criteria

1. WHEN a search completes with zero results, THE Search_Page SHALL display an empty state message containing the searched query text.
2. THE Search_Page SHALL render the empty state message in a centered layout with a minimum font size of 14px.
3. WHEN a search fails due to a network or API error, THE Search_Page SHALL display an error message in red/error-colored text.
4. IF the Search_Input is cleared after a failed or empty search, THEN THE Search_Page SHALL return to displaying the Browse_Section.

---

### Requirement 7: Preserve Existing Search Behaviour

**User Story:** As a listener, I want the redesigned page to keep all existing search functionality intact, so that nothing I relied on before is broken.

#### Acceptance Criteria

1. THE Search_Input SHALL debounce user keystrokes by 400ms before triggering a search request.
2. WHEN the Search_Input value changes, THE Search_Page SHALL cancel any in-flight search request from the previous debounce cycle.
3. WHEN the Search_Input contains only whitespace, THE Search_Page SHALL NOT trigger a search request and SHALL display the Browse_Section.
4. THE Search_Page SHALL request up to 20 results per search query from the JioSaavn API.
5. THE Search_Page SHALL decode HTML entities (`&quot;`, `&#039;`, `&amp;`) in song names before rendering them.

---

### Requirement 8: Visual Style Consistency

**User Story:** As a listener, I want the redesigned search page to feel cohesive with the rest of the app's dark theme, so that it doesn't look out of place.

#### Acceptance Criteria

1. THE Search_Page SHALL use `#0a0a0a` as the page background color.
2. THE Category_Card gradient backgrounds SHALL use saturated, visually distinct color pairs (e.g., purple-to-blue, green-to-teal, orange-to-red) that remain legible against white text.
3. THE Top_Result_Card SHALL use a dark card background (neutral-900 or equivalent) consistent with the existing song row style.
4. WHEN a user hovers over a Category_Card, THE Search_Page SHALL apply a subtle brightness or scale transition of no more than 110% scale or 10% brightness increase.
5. WHEN a user hovers over a song row in the Songs_List, THE Search_Page SHALL apply a background color change to neutral-800 or equivalent.
