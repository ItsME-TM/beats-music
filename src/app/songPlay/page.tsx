"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/authProvider";
import SongPlayer from "@/components/SongPlayer";

export default function SongPlayPage() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex pt-6 pl-25 pr-20 pb-2 flex-row ">
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
        </div>
        <div className="flex flex-col w-[40%]">

        </div>
    </div>
  );
}
