import { useContext } from "react";
import { AuthContext, PlayerContext } from "@/providers/AuthProvider";

export default function useAuth() {
  const { user } = useContext(AuthContext);
  return user;
}

export function usePlayer() {
  return useContext(PlayerContext);
}
