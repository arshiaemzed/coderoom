import type { ReactNode } from "react";

type RoomContextValue = {
  rooms: Array<Room>;
  searchRooms: (searchStr: string) => Promise<void>;
};

type Room = {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
};

type RoomContextProps = {
  children: ReactNode;
};

export type { Room, RoomContextProps, RoomContextValue };
