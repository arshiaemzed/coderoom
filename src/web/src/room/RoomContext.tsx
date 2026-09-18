import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchRooms } from "../api/room";

type Room = {
  id: string;
  name: string;
};

type RoomContextValue = {
  rooms: Array<Room>;
};

type RoomContextProps = {
  children: ReactNode;
};

const RoomContext = createContext<RoomContextValue | null>(null);

export function RoomProvider({ children }: RoomContextProps) {
  const [rooms, setRoom] = useState<RoomContextValue | null>(null);

  useEffect(() => {
    async function getRooms() {
      try {
        const rooms = await fetchRooms();
        setRoom(rooms);
      } catch (err) {
        setRoom(null);
        console.error(err);
      }
    }

    getRooms();
  });

  return <RoomContext value={rooms}>{children}</RoomContext>;
}

export function useRoom() {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error("useRoom must be used inside RoomProvider");
  }

  return context;
}
