interface InvitedUser {
  id: string;
  userId: string;
  roomId: string;
  invitedBy: string;
  createdAt: Date;
}

export type { InvitedUser };
