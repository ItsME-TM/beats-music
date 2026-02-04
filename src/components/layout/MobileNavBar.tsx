"use client";

import { useRouter, usePathname } from "next/navigation";
import { 
  HomeIcon, 
  PlayIcon, 
  SearchIcon, 
  LibraryIcon, 
  UserIcon 
} from "@/components/ui/Icons";

export default function MobileNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const go = (path: string) => {
    if (pathname !== path) router.push(path);
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navItems = [
    {
      path: "/home",
      label: "Home",
      icon: HomeIcon,
    },
    {
      path: "/songPlay",
      label: "Play",
      icon: PlayIcon,
    },
    {
      path: "/searchSong",
      label: "Search",
      icon: SearchIcon,
    },
    {
      path: "/library",
      label: "Library",
      icon: LibraryIcon,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: UserIcon,
    },
  ];

  return (
    <nav className="mobile-nav md:hidden flex items-center justify-around bg-neutral-900 border-t border-white/5 backdrop-blur-md bg-opacity-95">
      {navItems.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => go(item.path)}
            className={`flex flex-col items-center justify-center py-2 px-3 min-w-[60px] transition-all duration-300 ${
              active ? "text-cyan-400 scale-105" : "text-gray-400 hover:text-white"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-6 w-6" />
            <span className="text-[10px] mt-1 font-medium tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
