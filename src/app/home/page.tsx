"use client";
import { getSongImage } from "@/utils/imageUtils";

// ... existing imports ...
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
// import { MdLibraryMusic } from "react-icons/md";
import Image from "next/image";
import { IoPlayCircleOutline } from "react-icons/io5";
import { searchSongs } from "@/services/jioSaavnApi";
import HomeSkeleton from "@/components/skeleton/HomeSkeleton";

export default function HomePage() {
  const user = useAuth();
  const router = useRouter();
  const [searchSongDetails, setSearchSongDetails] = useState("");
  // Using 'any' for now to quickly map the API response, ideally should use the interface
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [songs, setSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchNewReleases = async () => {
      setIsLoading(true);
      try {
        // Fetching 10 songs to show 7/8 in grid and use 10th for featured
        const results = await searchSongs("English Top Hits", 10);
        if (results && results.length > 0) {
          setSongs(results);
        }
      } catch (error) {
        console.error("Failed to fetch songs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewReleases();
  }, []);

  const handleSongClick = (songId: string) => {
    router.push(`/songPlay?id=${songId}`);
  };

  const featuredSong = songs[9];

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="flex flex-col pt-4 sm:pt-6 md:pt-8 lg:pt-10 px-4 md:pl-8 lg:pl-12 md:pr-[70px] lg:pr-[100px] pb-24 md:pb-8 w-full max-w-[100vw]">
      {/* ... keeping header content same ... */}
      <div className="flex flex-col lg:flex-row mt-2 gap-8 lg:gap-12">
        <div className="flex flex-col lg:w-3/5 xl:w-[60%]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-k2d font-bold leading-tight tracking-tight">
            THE MULTI-UNIVERSAL <br className="hidden sm:block" /> MUSIC PLAYLIST
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-k2d mt-3 sm:mt-5 text-gray-300 leading-relaxed max-w-2xl">
            Discover the magic of music with us. Our platform is your gateway to
            a world of melodies, rhythms, and emotions. Whether you&apos;re a
            passionate listener, a budding artist, or an industry professional,
            we have something special for you.
          </p>
          {/* Mobile search - visible only on small screens */}
          <div className="sm:hidden bg-[#181818] h-11 flex items-center justify-between rounded-full mt-6 pl-4 pr-3 w-full border border-white/5 focus-within:border-cyan-400/50 transition-colors">
            <input
              type="text"
              placeholder="Search something..."
              value={searchSongDetails}
              onChange={(e) => setSearchSongDetails(e.target.value)}
              className="bg-transparent text-white text-sm pl-1 outline-none placeholder-gray-400 flex-1"
            />
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Desktop search suggestion/input placeholder (if distinct from header, otherwise maybe remove or style differently) */}
          <div className="hidden sm:flex bg-[#181818] h-12 items-center justify-between rounded-full mt-8 md:mt-10 pl-5 pr-4 w-full max-w-[560px] border border-white/5 focus-within:border-cyan-400/50 transition-colors shadow-lg shadow-black/20">
            <input
              type="text"
              placeholder="Search something..."
              value={searchSongDetails}
              onChange={(e) => setSearchSongDetails(e.target.value)}
              className="bg-transparent text-white text-sm outline-none placeholder-gray-400 flex-1"
            />
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex flex-col lg:w-2/5 xl:w-[40%] items-center lg:items-start text-center lg:text-left mt-6 lg:mt-0 relative">
          <div 
            className="relative z-10 cursor-pointer group/header"
            onClick={() => featuredSong && handleSongClick(featuredSong.id)}
          >
            <span className="text-sm sm:text-base lg:text-lg font-bold font-k2d block text-cyan-400 mb-1 uppercase group-hover/header:text-white transition-colors">
              NEW SONG: {featuredSong ? featuredSong.name.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&") : "ONE OF THE GIRLS"}
            </span>
            <span className="text-xs sm:text-sm font-k2d text-gray-400 block mb-4">
              {featuredSong ? (featuredSong.primaryArtists || featuredSong.artist) : "The Weeknd, JENNIE & Lily Rose Depp"}
            </span>
          </div>
           {/* Decorative blurred background for image */}
          <div className="relative group cursor-pointer" onClick={() => featuredSong && handleSongClick(featuredSong.id)}>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <Image
                src={getSongImage(featuredSong)}
                alt={featuredSong?.name || "Music player"}
                width={320}
                height={320}
                className="relative mt-2 w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] object-cover rounded-full drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
                unoptimized
            />
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <div className="flex flex-row items-center gap-2 mb-4 sm:mb-6">
          <span className="font-inter text-base sm:text-lg font-bold tracking-wide">
            New Releases
          </span>
          <IoPlayCircleOutline className="text-cyan-400 w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition-transform cursor-pointer" />
        </div>
        
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-5">
          {songs.slice(0, 8).map((song, index) => (
            <div 
              key={song.id} 
              className={`group cursor-pointer flex flex-col ${index === 7 ? 'lg:hidden' : ''}`}
              onClick={() => handleSongClick(song.id)}
            >
              <div className="relative overflow-hidden rounded-xl aspect-square shadow-lg shadow-black/40">
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-end p-2">
                    <IoPlayCircleOutline className="text-white w-8 h-8 drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                 </div>
                <Image
                  src={getSongImage(song)}
                  alt={song.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  unoptimized // Add unoptimized if domains are not configured in next.config.ts
                />
              </div>
              <span className="block font-bold text-xs sm:text-sm text-white mt-3 truncate group-hover:text-cyan-400 transition-colors">
                {song.name
                  .replace(/&quot;/g, '"')
                  .replace(/&#039;/g, "'")
                  .replace(/&amp;/g, "&")}
              </span>
              <span className="block text-[10px] sm:text-xs text-gray-400 truncate mt-1">
                {song.primaryArtists || song.artist}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

