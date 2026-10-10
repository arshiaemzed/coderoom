import { createContext, useContext, useEffect, useState } from "react";
import { fetchRooms, searchRooms } from "../api/room";
import { useAuth } from "../auth/AuthContext";
import type { RoomContextValue } from "./RoomContextValue";
import type { RoomContextProps } from "./RoomContextProps";
import type { Room } from "./Room";

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({ children }: RoomContextProps) {
  const [rooms, setRooms] = useState<Room[]>([]);

  const { status } = useAuth();

  async function getSearchedRooms(searchStr: string): Promise<void> {
    try {
      const rooms = await searchRooms(searchStr);

      setRooms(rooms);
    } catch (err) {
      setRooms([]);
      console.error(err);
    }
  }

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

  return (
    <RoomContext value={{ rooms: rooms, searchRooms: getSearchedRooms }}>
      {children}
    </RoomContext>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error("useRoom must be used inside RoomProvider");
  }

  return context;
}
