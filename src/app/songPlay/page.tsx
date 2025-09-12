"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/authProvider";

export default function SongPlayPage(){
        const user = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!user) {
                router.push("/login");
            }
        }, [user, router]);

    return(
        <div>
            Song Play Page
        </div>
    );
}