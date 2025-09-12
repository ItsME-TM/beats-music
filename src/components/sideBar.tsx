"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineHome, HiOutlineMusicNote } from "react-icons/hi";
import { LuDiscAlbum } from "react-icons/lu";
import { TbUserHexagon } from "react-icons/tb";
import { MdOutlineLibraryMusic, MdExitToApp  } from "react-icons/md";
import { RiMic2Line, RiRadio2Fill } from "react-icons/ri";
import Popup from "@/components/PopUp";
import { auth } from "@/app/firebase";

export default function SideBar() {
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        auth.signOut();
        localStorage.clear();
        router.push("/login");
    };
    
    const go = (path: string) => {
        if(pathname !== path) router.push(path);
    };

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path + "/");
    };

    const baseIcon = "h-6 w-6 transition-colors"

    return (
        <>
            <div className="fixed right-0 top-0 h-full w-15 bg-neutral-900 flex flex-col items-center justify-center space-y-10 py-8 z-50">
                <HiOutlineHome 
                    title="Home"
                    onClick={() => go("/home")}
                    aria-current = {isActive("/home") ? "page" : undefined}
                    className={`${baseIcon} ${isActive("/home") ? "text-cyan-400" : "text-white"} cursor-pointer`} 
                />
                <LuDiscAlbum 
                    title="Song Play"
                    className={`${baseIcon} ${isActive("/songPlay") ? "text-cyan-400" : "text-white"} cursor-pointer`}
                    onClick={() => go("/songPlay")}
                    aria-current={isActive("/songPlay") ? "page" : undefined} 
                />
                <MdOutlineLibraryMusic 
                    title="Search Song"
                    className={`${baseIcon} ${isActive("/searchSong") ? "text-cyan-400" : "text-white"} cursor-pointer`}
                    onClick={() => go("/searchSong")}
                    aria-current={isActive("/searchSong") ? "page" : undefined} 
                    />
                <HiOutlineMusicNote className="h-6 w-6 text-gray-500 cursor-pointer" />
                <TbUserHexagon className="h-6 w-6 text-gray-500 cursor-pointer" />
                <RiMic2Line className="h-6 w-6 text-gray-500 cursor-pointer" />
                <RiRadio2Fill className="h-6 w-6 text-gray-500 cursor-pointer" />
                <MdExitToApp className="h-6 w-6 text-white cursor-pointer" onClick={() => setShowPopup(true)} />
            </div>
            <Popup
                message="Are you sure you want to logout?"
                open={showPopup}
                onConfirm={handleLogout}
                onCancel={() => setShowPopup(false)}
            />
        </>
    );
}