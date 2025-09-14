"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/authProvider";
import SongPlayer from "@/components/SongPlayer";
import RecentPlayed from "@/components/RecentPlayed";
import SongReleases, { Release } from "@/components/songReleases";

export default function SongPlayPage() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex pt-2 pl-25 pr-20 pb-2 flex-row ">
      <div className="flex-col w-[60%] flex-1">
        <SongPlayer
          title="ONE OF THE GIRLS"
          artists={["The Weeknd", "JENNIE", "Lily-Rose Depp"]}
          audioSrc="/audio/one-of-the-girls.m4a"
          coverUrl="/images/one-of-the-girl-banner.png"
          duration={244}
          lyrics={[
            { time: 0, text: "Instrumental intro..." },
            { time: 12, text: "Verse line about the night sky" },
            { time: 24, text: "Echoes drift across the city" },
            { time: 36, text: "Heartbeat syncs to faded lights" },
            { time: 48, text: "Chorus lifts like rising fire" },
            { time: 60, text: "We move as one through the wire" },
            { time: 75, text: "Second verse, a softer tone" },
            { time: 90, text: "Promises carved in chrome" },
            { time: 105, text: "Chorus returns, brighter than before" },
            { time: 135, text: "Bridge holds the moment" },
            { time: 165, text: "Final chorus, crowd in bloom" },
            { time: 195, text: "Outro fades into the room" },
          ]}
          onAddToPlaylist={() => console.log("Add to playlist clicked")}
          onPrev={() => console.log("Prev")}
          onNext={() => console.log("Next")}
        />
        <div className="pt-2">
          <RecentPlayed
            songs={[
              {
                id: 1,
                title: "All I Want For Christmas Is You",
                artist: "Maria Carey",
                album: "Album",
                duration: "3:54",
                image: "/images/maria.png",
                isFavorite: false,
              },
              {
                id: 2,
                title: "One of the girls",
                artist: "The Weekn & JENNIE...",
                album: "-R-",
                duration: "3:54",
                image: "/images/jennie.png",
                isPlaying: true,
                isFavorite: true,
              },
              {
                id: 3,
                title: "Donda",
                artist: "Kanye West",
                album: "Donda",
                duration: "3:54",
                image: "/images/donda.png",
                isFavorite: false,
              },
            ]}
          />
        </div>
        <div>
          <SongReleases
            releases={
              [
                {
                  id: 1,
                  title: "Way Back Home",
                  artist: "SHAUN",
                  image: "/images/shawn.jpg",
                },
                {
                  id: 2,
                  title: "Rockabye",
                  artist: "The Clean Bandit",
                  image: "/images/clean_bandith.jpg",
                },
                {
                  id: 3,
                  title: "Graduation",
                  artist: "Kanye West",
                  image: "/images/kanye.png",
                },
                {
                  id: 4,
                  title: "Stay",
                  artist: "Zedd",
                  image: "/images/zedd.jpg",
                },
                {
                  id: 5,
                  title: "abcdefu",
                  artist: "GAYLE",
                  image: "/images/gayle.jpg",
                },
                {
                  id: 6,
                  title: "Bad Habits",
                  artist: "Ed Sheeran",
                  image: "/images/edsheeran.jpg",
                },
                {
                  id: 7,
                  title: "At My Worst",
                  artist: "Pink Sweat$",
                  image: "/images/pink_sweat.jpg",
                },
              ] as Release[]
            }
            onSelect={(r) => console.log("Selected release", r)}
          />
        </div>
      </div>

      <div className="flex flex-col w-[40%]"></div>
    </div>
  );
}
