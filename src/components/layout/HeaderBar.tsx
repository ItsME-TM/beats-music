"use client";
import { LogoIcon } from "@/components/ui/Icons";
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
    <header className="h-12 sm:h-14 flex items-center justify-between mt-2 sm:mt-3 md:mt-4 px-3 sm:px-4 md:pl-6 lg:pl-10 md:pr-[70px] lg:pr-[100px] w-full">
      <div className="flex items-center justify-center shrink-0">
        <LogoIcon className="w-6 h-6 sm:w-6 sm:h-6" />
        <span className="ml-2 sm:ml-2 mt-2 sm:mt-3 text-md sm:text-lg font-bold font-inika tracking-wider">BEATS MUSIC</span>
      </div>
      {/* {isLoggedIn && (
        <div className="hidden sm:flex bg-[#181818] h-8 sm:h-9 md:h-10 items-center justify-between rounded-2xl pl-4 pr-3 flex-1 mx-3 sm:mx-6 md:mx-10 max-w-[600px] border border-white/5 focus-within:border-cyan-400/50 transition-colors">
          <input
            type="text"
            placeholder="Search something..."
            value={searchValue}
            onChange={onSearchChange}
            className="bg-transparent text-white text-[10px] sm:text-xs outline-none placeholder-gray-400 flex-1 min-w-0"
          />
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      )} */}
    </header>
  );
}
