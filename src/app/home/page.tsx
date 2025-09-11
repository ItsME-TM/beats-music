"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/authProvider";
import { MdLibraryMusic } from "react-icons/md";
import Popup from "@/components/PopUp";
import { auth } from "@/app/firebase";
import Image from "next/image";

export default function HomePage(){
    const user = useAuth();
    const router = useRouter();
    const [searchSongDetails, setSearchSongDetails] = useState("");

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    return(
        <div className="flex flex-col pt-10 pl-20 pr-25 pb-5">
            <div className="flex flex-row h-75 mt-4">
                <div className="flex flex-col w-[57%]">
                    <span className="text-5xl font-k2d font-bold">THE MUTIL-UNIVERSAL MUSIC PLAYLIST</span>
                    <span className="text-md font-k2d mt-3">Discover the magic of music with us. 
                        Our platform is your gateway to a world of melodies, 
                        rhythms, and emotions. Whether you&apos;re a passionate listener, 
                        a budding artist, or an industry professional, 
                        we have something special for you.
                    </span>
                    <div className="bg-[#181818] w-140 h-10 flex items-center justify-between rounded-2xl mt-10 pl-2 pr-2">
                        <input
                            type="text"
                            placeholder="Search something..."
                            value={searchSongDetails}
                            onChange={e => setSearchSongDetails(e.target.value)}
                            className="bg-transparent text-white text-xs pl-3 outline-none placeholder-white flex-1"
                        />
                        <MdLibraryMusic size={20} color="white" className="ml-2 mr-4" />
                    </div>
                </div>
                <div className="flex flex-col w-[43%] items-center">
                    <span className="text-lg font-bold font-k2d ">NEW SONG: ONE OF THE GIRLS</span>
                    <span className="text-sm font-k2d">The Weeknd, JENNIE & Lily Rose Depp</span>
                    <Image
                        src="/images/music-player.png" 
                        alt="Music player"
                        width={280}
                        height={280}
                        className="mt-5" 
                    />
                </div>
            </div>
            <div>b</div>
        </div>
    );
}