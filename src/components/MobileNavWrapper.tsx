"use client";

import { usePathname } from "next/navigation";
import MobileNavBar from "./MobileNavBar";

export default function MobileNavWrapper() {
  const pathname = usePathname();
  const hideOn = ["/login", "/register"];
  if (hideOn.includes(pathname)) return null;
  return <MobileNavBar />;
}
