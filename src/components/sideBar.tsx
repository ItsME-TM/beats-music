"use client";

import { HiOutlineHome, HiOutlineMusicNote } from "react-icons/hi";
import { LuDiscAlbum } from "react-icons/lu";
import { TbUserHexagon } from "react-icons/tb";
import { MdOutlineLibraryMusic, MdExitToApp  } from "react-icons/md";
import { RiMic2Line, RiRadio2Fill } from "react-icons/ri";

export default function SideBar() {
    return (
        <div className="fixed right-0 top-0 h-full w-15 bg-neutral-900 flex flex-col items-center justify-center space-y-10 py-8 z-50">
            <HiOutlineHome className="h-6 w-6 text-white cursor-pointer" />
            <LuDiscAlbum className="h-6 w-6 text-white cursor-pointer" />
            <MdOutlineLibraryMusic className="h-6 w-6 text-white cursor-pointer" />
            <HiOutlineMusicNote className="h-6 w-6 text-white cursor-pointer" />
            <TbUserHexagon className="h-6 w-6 text-white cursor-pointer" />
            <RiMic2Line className="h-6 w-6 text-white cursor-pointer" />
            <RiRadio2Fill className="h-6 w-6 text-white cursor-pointer" />
            <MdExitToApp className="h-6 w-6 text-white cursor-pointer" />
        </div>
    );
}