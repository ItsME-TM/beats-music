import { TopSong } from "@/components/TopGlobalSongs";

export const songsList: TopSong[] = [
  // Jada Facec - 3 songs
  { id: 1, title: "Sunset Drive", artist: "Jada Facec", duration: "3:45", image: "/images/jada-facec.jpg" },
  { id: 2, title: "Midnight City", artist: "Jada Facec", duration: "4:12", image: "/images/jada-facec.jpg" },
  { id: 3, title: "Neon Lights", artist: "Jada Facec", duration: "3:58", image: "/images/jada-facec.jpg" },
  
  // Against the Current - 4 songs
  { id: 4, title: "Infinite", artist: "Against the Current", duration: "3:28", image: "/images/against-current.jpg" },
  { id: 5, title: "Burning Bridges", artist: "Against the Current", duration: "3:42", image: "/images/against-current.jpg" },
  { id: 6, title: "Runnin'", artist: "Against the Current", duration: "3:55", image: "/images/against-current.jpg" },
  { id: 7, title: "Dreamer", artist: "Against the Current", duration: "4:05", image: "/images/against-current.jpg" },
  
  // Chainsmokers - 4 songs
  { id: 8, title: "Closer", artist: "Chainsmokers", duration: "4:04", image: "/images/chainsmokers.jpg" },
  { id: 9, title: "Something Just Like This", artist: "Chainsmokers", duration: "3:57", image: "/images/chainsmokers.jpg" },
  { id: 10, title: "Paris", artist: "Chainsmokers", duration: "3:22", image: "/images/chainsmokers.jpg" },
  { id: 11, title: "Selfless", artist: "Chainsmokers", duration: "3:38", image: "/images/chainsmokers.jpg" },
  
  // Ariana Grande - 4 songs
  { id: 12, title: "thank u, next", artist: "Ariana Grande", duration: "3:27", image: "/images/ariana-grande.jpg" },
  { id: 13, title: "7 Rings", artist: "Ariana Grande", duration: "3:09", image: "/images/ariana-grande.jpg" },
  { id: 14, title: "No Tears Left to Cry", artist: "Ariana Grande", duration: "3:33", image: "/images/ariana-grande.jpg" },
  { id: 15, title: "God is a woman", artist: "Ariana Grande", duration: "3:10", image: "/images/ariana-grande.jpg" },
  
  // Ellie Goulding - 4 songs
  { id: 16, title: "Love Me Like You Do", artist: "Ellie Goulding", duration: "4:03", image: "/images/ellie-goulding.jpg" },
  { id: 17, title: "Your Song", artist: "Ellie Goulding", duration: "4:06", image: "/images/ellie-goulding.jpg" },
  { id: 18, title: "Burn", artist: "Ellie Goulding", duration: "3:36", image: "/images/ellie-goulding.jpg" },
  { id: 19, title: "On My Mind", artist: "Ellie Goulding", duration: "3:29", image: "/images/ellie-goulding.jpg" },
  
  // Charlie Puth - 4 songs
  { id: 20, title: "See You Again", artist: "Charlie Puth", duration: "4:52", image: "/images/charlie-puth.jpg" },
  { id: 21, title: "We Don't Talk Anymore", artist: "Charlie Puth", duration: "3:37", image: "/images/charlie-puth.jpg" },
  { id: 22, title: "Attention", artist: "Charlie Puth", duration: "3:33", image: "/images/charlie-puth.jpg" },
  { id: 23, title: "Left and Right", artist: "Charlie Puth", duration: "3:15", image: "/images/charlie-puth.jpg" },
  
  // Selena Gomez - 4 songs
  { id: 24, title: "Lose You to Love Me", artist: "Selena Gomez", duration: "3:21", image: "/images/selena-gomez.jpg" },
  { id: 25, title: "Good for You", artist: "Selena Gomez", duration: "3:42", image: "/images/selena-gomez.jpg" },
  { id: 26, title: "Same Old Love", artist: "Selena Gomez", duration: "3:36", image: "/images/selena-gomez.jpg" },
  { id: 27, title: "Hands to Myself", artist: "Selena Gomez", duration: "3:30", image: "/images/selena-gomez.jpg" },
  
  // Kygo - 4 songs
  { id: 28, title: "Firestone", artist: "Kygo", duration: "4:01", image: "/images/kygo.jpg" },
  { id: 29, title: "Kids Again", artist: "Kygo", duration: "3:22", image: "/images/kygo.jpg" },
  { id: 30, title: "Stole the Show", artist: "Kygo", duration: "3:37", image: "/images/kygo.jpg" },
  { id: 31, title: "It Ain't Me", artist: "Kygo", duration: "3:14", image: "/images/kygo.jpg" },
  
  // Alan Walker - 4 songs
  { id: 32, title: "Faded", artist: "Alan Walker", duration: "3:33", image: "/images/alan-walker.jpg" },
  { id: 33, title: "Alone", artist: "Alan Walker", duration: "3:14", image: "/images/alan-walker.jpg" },
  { id: 34, title: "Sing Me to Sleep", artist: "Alan Walker", duration: "3:16", image: "/images/alan-walker.jpg" },
  { id: 35, title: "Isle of Hope", artist: "Alan Walker", duration: "2:56", image: "/images/alan-walker.jpg" },
];

export function getRandomSongs(count: number = 10): TopSong[] {
  const shuffled = [...songsList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
