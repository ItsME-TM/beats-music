"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/firebase";

const AuthContext = createContext<User | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export default function useAuth() {
  return useContext(AuthContext);
}