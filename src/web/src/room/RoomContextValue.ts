import type { Room } from "./Room";

export type RoomContextValue = {
  rooms: Array<Room>;
  searchRooms: (searchStr: string) => Promise<void>;
};
