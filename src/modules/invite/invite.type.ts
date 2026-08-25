interface InvitedUser {
  id: string;
  userId: string;
  roomId: string;
  invitedBy: string;
  createdAt: Date;
}

interface RoomMember {
  id: string;
  userId: string;
  roomId: string;
}

export type { InvitedUser, RoomMember };
