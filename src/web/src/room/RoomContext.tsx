import { createContext, useContext, useEffect, useState } from "react";
import { fetchRooms } from "../api/room";
import { useAuth } from "../auth/AuthContext";
import type { Room, RoomContextProps } from "./types";

const RoomContext = createContext<Room[]>([]);

export function RoomProvider({ children }: RoomContextProps) {
  const [rooms, setRooms] = useState<Room[]>([]);

  const { status } = useAuth();

  useEffect(() => {
    if (status !== "authenticated") {
      setRooms([]);
      return;
    }

    async function getRooms() {
      try {
        const rooms = await fetchRooms();
        setRooms(rooms);
      } catch (err) {
        setRooms([]);
        console.error(err);
      }
    }

    getRooms();
  }, [status]);

  return <RoomContext value={rooms}>{children}</RoomContext>;
}

export function useRoom() {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error("useRoom must be used inside RoomProvider");
  }

  return context;
}
