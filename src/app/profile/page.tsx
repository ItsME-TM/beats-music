"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { auth } from "@/app/firebase";

export default function ProfilePage() {
  const user = useAuth();
  const router = useRouter();
  const [songsPlayed, setSongsPlayed] = useState(0);
  const [playlistsCount, setPlaylistsCount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    try {
      const rawPlaylists = localStorage.getItem(`playlists_${user.uid}`);
      const playlists = rawPlaylists ? JSON.parse(rawPlaylists) : [];
      setPlaylistsCount(Array.isArray(playlists) ? playlists.length : 0);
    } catch {
      setPlaylistsCount(0);
    }
    try {
      const rawSongs = localStorage.getItem(`songsPlayed_${user.uid}`);
      setSongsPlayed(rawSongs ? parseInt(rawSongs, 10) || 0 : 0);
    } catch {
      setSongsPlayed(0);
    }
  }, [user]);

  const handleLogout = async () => {
    if (auth && typeof auth.signOut === "function") {
      try {
        await auth.signOut();
      } catch (err) {
        console.error("Sign out failed:", err);
      }
    }
    router.push("/login");
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "?";
  };

  if (!user) return null;

  return (
    <div
      className="min-h-screen w-full pb-24 md:pb-8 px-4 md:px-8 lg:px-12 pt-8"
      style={{ background: "#0a0a0a" }}
    >
      {/* Profile card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-neutral-900 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 shadow-lg shadow-black/40">
          {/* Avatar */}
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "Avatar"}
              width={96}
              height={96}
              className="rounded-full object-cover ring-2 ring-cyan-400"
              unoptimized
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white ring-2 ring-cyan-400"
              style={{ background: "#22d3ee22" }}
            >
              <span style={{ color: "#22d3ee" }}>{getInitials()}</span>
            </div>
          )}

          {/* Name & email */}
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {user.displayName || "Anonymous"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="mt-2 px-6 py-2 rounded-full text-sm font-semibold transition-colors"
            style={{
              background: "#22d3ee",
              color: "#0a0a0a",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#06b6d4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#22d3ee")}
          >
            Log out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-neutral-900 rounded-2xl p-6 flex flex-col items-center gap-2 shadow-lg shadow-black/40">
            <span className="text-3xl font-bold" style={{ color: "#22d3ee" }}>
              {songsPlayed}
            </span>
            <span className="text-sm text-gray-400">Songs Played</span>
          </div>
          <div className="bg-neutral-900 rounded-2xl p-6 flex flex-col items-center gap-2 shadow-lg shadow-black/40">
            <span className="text-3xl font-bold" style={{ color: "#22d3ee" }}>
              {playlistsCount}
            </span>
            <span className="text-sm text-gray-400">Playlists</span>
          </div>
        </div>
      </div>
    </div>
  );
}
