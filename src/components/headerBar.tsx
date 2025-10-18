"use client";
import Image from "next/image";
import { MdLibraryMusic } from "react-icons/md";
import { ChangeEvent } from "react";
interface HeaderProps {
  isLoggedIn?: boolean;
  searchValue: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Header({
  isLoggedIn,
  searchValue,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="h-12 sm:h-14 flex items-center justify-between mt-3 sm:mt-4 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="flex items-center">
        <Image
          src="/icons/left-logo.png"
          alt="left Logo"
          width={32}
          height={32}
        />
        <span className="ml-4 text-sm font-bold font-inika">BEATS MUSIC</span>
      </div>
      {isLoggedIn && (
        <div className="hidden sm:flex bg-[#181818] h-9 sm:h-10 items-center justify-between rounded-2xl pl-2 pr-2 w-[48vw] md:w-[38vw] lg:w-[520px]">
          <input
            type="text"
            placeholder="Search something..."
            value={searchValue}
            onChange={onSearchChange}
            className="bg-transparent text-white text-xs pl-3 outline-none placeholder-white flex-1"
          />
          <MdLibraryMusic size={20} color="white" className="ml-2 mr-4" />
        </div>
      )}
      <div className="relative hidden sm:flex items-center">
        <div className="absolute -top-2 right-20 sm:static sm:mr-2 z-10">
          <span className="text-xs sm:text-sm font-Inter">after</span>
          <span className="text-xs sm:text-sm font-bold font-Inter">pay</span>
        </div>
        <Image
          src="/icons/right-1-logo.png"
          alt="left Logo"
          width={40}
          height={40}
        />
        <Image
          src="/icons/right-2-logo.png"
          alt="left Logo"
          width={60}
          height={60}
          className="ml-4"
        />
      </div>
    </header>
  );
}
