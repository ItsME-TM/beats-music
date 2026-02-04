"use client";

import { usePathname } from "next/navigation";
import SideBar from "./SideBar";

export default function SideBarWrapper() {
    const pathname = usePathname();
    const showSidebar = !(pathname === "/login" || pathname === "/register");

    return showSidebar ? <SideBar /> : null;
}