"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  HomeIcon,
  PlayIcon,
  SearchIcon,
  MusicNoteIcon,
  UserIcon,
  LogoutIcon,
} from "@/components/ui/Icons";
import Popup from "@/components/ui/PopUp";
import { auth } from "@/app/firebase";

export default function SideBar() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
    }
    localStorage.clear();
    router.push("/login");
  };

  const go = (path: string) => {
    if (pathname !== path) router.push(path);
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const baseIcon = "h-6 w-6 transition-colors";

  return (
    <>
      <div className="hidden md:flex fixed right-0 top-0 h-full w-13 lg:w-15 bg-neutral-900 flex-col items-center justify-center space-y-8 lg:space-y-10 py-6 lg:py-8 z-50 shadow-xl border-l border-white/5">
        <HomeIcon
          onClick={() => go("/home")}
          aria-current={isActive("/home") ? "page" : undefined}
          className={`${baseIcon} ${
            isActive("/home")
              ? "text-cyan-400"
              : "text-gray-400 hover:text-white"
          } cursor-pointer`}
        />
        <PlayIcon
          className={`${baseIcon} ${
            isActive("/songPlay")
              ? "text-cyan-400"
              : "text-gray-400 hover:text-white"
          } cursor-pointer`}
          onClick={() => go("/songPlay")}
          aria-current={isActive("/songPlay") ? "page" : undefined}
        />
        <SearchIcon
          className={`${baseIcon} ${
            isActive("/searchSong")
              ? "text-cyan-400"
              : "text-gray-400 hover:text-white"
          } cursor-pointer`}
          onClick={() => go("/searchSong")}
          aria-current={isActive("/searchSong") ? "page" : undefined}
        />
        <MusicNoteIcon
          onClick={() => go("/library")}
          aria-current={isActive("/library") ? "page" : undefined}
          className={`${baseIcon} ${
            isActive("/library")
              ? "text-cyan-400"
              : "text-gray-400 hover:text-white"
          } cursor-pointer`}
        />
        <UserIcon
          onClick={() => go("/profile")}
          aria-current={isActive("/profile") ? "page" : undefined}
          className={`${baseIcon} ${
            isActive("/profile")
              ? "text-cyan-400"
              : "text-gray-400 hover:text-white"
          } cursor-pointer`}
        />

        <div className="mt-auto">
          <LogoutIcon
            className="h-6 w-6 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
            onClick={() => setShowPopup(true)}
          />
        </div>
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
