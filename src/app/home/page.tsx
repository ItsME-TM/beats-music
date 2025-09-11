"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/components/authProvider";
import Popup from "@/components/PopUp";
import { auth } from "@/app/firebase";

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
            Home
        </div>
    );
}