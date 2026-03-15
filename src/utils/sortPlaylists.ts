export type SortOrder = "recents" | "recentlyAdded" | "alpha";

// Matches the Playlist type from src/components/YourPlayLists.tsx
export type Playlist = {
  id: number;
  name: string;
  description?: string;
};

export function sortPlaylists(
  playlists: Playlist[],
  order: SortOrder,
): Playlist[] {
  const copy = [...playlists];
  if (order === "alpha")
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  return copy.sort((a, b) => b.id - a.id);
}
