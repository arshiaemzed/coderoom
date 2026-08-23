interface DatabaseRoom {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
}

interface RoomFile {
  id: string;
  roomId: string;
  fileName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { DatabaseRoom, RoomFile };
