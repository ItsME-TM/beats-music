"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/authProvider";
import { MdLibraryMusic } from "react-icons/md";
import Image from "next/image";
import { IoPlayCircleOutline } from "react-icons/io5";

export default function HomePage() {
  const user = useAuth();
  const router = useRouter();
  const [searchSongDetails, setSearchSongDetails] = useState("");
  const songs = [
    {
      image: "/images/weeknd.png",
      title: "Blinding Lights",
      artist: "The Weeknd",
    },
    {
      image: "/images/selena.jpg",
      title: "Lose You To Love Me",
      artist: "Selena Gomez",
    },
    {
      image: "/images/coldplay.jpg",
      title: "Viva La Vida",
      artist: "Coldplay",
    },
    {
      image: "/images/weeknd.png",
      title: "Save Your Tears",
      artist: "The Weeknd",
    },
    {
      image: "/images/selena.jpg",
      title: "Rare",
      artist: "Selena Gomez",
    },
    {
      image: "/images/coldplay.jpg",
      title: "Paradise",
      artist: "Coldplay",
    },
    {
      image: "/images/weeknd.png",
      title: "Starboy",
      artist: "The Weeknd",
    },
  ];

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col pt-6 sm:pt-8 md:pt-10 px-4 sm:px-6 md:pl-10 md:pr-16 lg:px-20 pb-5 md:pr-[84px]">
      <div className="flex flex-col md:flex-row md:h-75 mt-2 gap-6">
        <div className="flex flex-col md:w-[57%]">
          <span className="text-3xl sm:text-4xl md:text-5xl font-k2d font-bold">
            THE MUTIL-UNIVERSAL MUSIC PLAYLIST
          </span>
          <span className="text-sm sm:text-base md:text-md font-k2d mt-3">
            Discover the magic of music with us. Our platform is your gateway to
            a world of melodies, rhythms, and emotions. Whether you&apos;re a
            passionate listener, a budding artist, or an industry professional,
            we have something special for you.
          </span>
          <div className="bg-[#181818] h-10 flex items-center justify-between rounded-2xl mt-6 sm:mt-8 md:mt-10 pl-2 pr-2 w-full md:w-[560px]">
            <input
              type="text"
              placeholder="Search something..."
              value={searchSongDetails}
              onChange={(e) => setSearchSongDetails(e.target.value)}
              className="bg-transparent text-white text-xs pl-3 outline-none placeholder-white flex-1"
            />
            <MdLibraryMusic size={20} color="white" className="ml-2 mr-4" />
          </div>
        </div>
        <div className="flex flex-col md:w-[43%] items-center text-center md:text-left">
          <span className="text-base sm:text-lg font-bold font-k2d ">
            NEW SONG: ONE OF THE GIRLS
          </span>
          <span className="text-xs sm:text-sm font-k2d">
            The Weeknd, JENNIE & Lily Rose Depp
          </span>
          <Image
            src="/images/music-player.png"
            alt="Music player"
            width={240}
            height={240}
            className="mt-4 sm:mt-5 md:w-[280px] md:h-[280px]"
          />
        </div>
      </div>
      <div>
        <div className="flex flex-row items-center gap-1 mt-4">
          <span className="font-inter text-xs sm:text-sm font-bold ">
            New Releases
          </span>
          <IoPlayCircleOutline color="#17DCF5" size={18} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 mt-2">
          {songs.map((song, idx) => (
            <div key={idx}>
              <Image
                src={song.image}
                alt={song.title}
                width={120}
                height={120}
              />
              <span className="block font-bold text-xs sm:text-sm text-white">
                {song.title}
              </span>
              <br />
              <span className="text-[10px] sm:text-xs text-gray-400">
                {song.artist}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
