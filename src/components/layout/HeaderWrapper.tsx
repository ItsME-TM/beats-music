"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./HeaderBar";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isLoggedIn = !(pathname === "/login" || pathname === "/register");
  const [searchValue, setSearchValue] = useState("");

  return (
    <Header
      isLoggedIn={isLoggedIn}
      searchValue={searchValue}
      onSearchChange={e => setSearchValue(e.target.value)}
    />
  );
}