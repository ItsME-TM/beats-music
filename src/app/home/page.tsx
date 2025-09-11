"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/authProvider";
import SideBar from "@/components/sideBar";

export default function HomePage(){
    const user = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
        }, [user, router]);

    return(
        <div className="">
            home
        </div>
        
    );
}