import db from "../../infrastructure/postgres/pool.js";
import type { InvitedUser } from "./invite.type.js";

async function hasBeenAlreadyInvited(roomId: string, userId: string) {
  const query = await db.query(
    `SELECT user_id FROM invites WHERE room_id = $1 AND user_id = $2`,
    [roomId, userId],
  );

  const result = query.rowCount == null ? false : query.rowCount > 0;

  return result;
}

async function inviteUser(
  invitedUserId: string,
  roomId: string,
  invitedBy: string,
): Promise<InvitedUser> {
  const query = await db.query(
    `
        INSERT INTO invites
            (user_id, room_id, invited_by)
        VALUES($1,$2,$3)
        RETURNING  
            id,
            user_id AS "userId",
            room_id AS "roomId",
            invited_by AS "invitedBy",
            created_at AS "createdAt";        
    `,
    [invitedUserId, roomId, invitedBy],
  );

  return query.rows[0];
}

async function revokeInvite(
  roomId: string,
  targetId: string,
): Promise<InvitedUser | undefined> {
  const query = await db.query(
    `
      DELETE FROM invites 
      WHERE 
        room_id = $1 
      AND 
        user_id = $2
      RETURNING  
        id,
        user_id AS "userId",
        room_id AS "roomId",
        invited_by AS "invitedBy",
        created_at AS "createdAt";      
    `,
    [roomId, targetId],
  );

  const result: InvitedUser | undefined = query.rows[0];

  return result;
}

export default {
  inviteUser,
  revokeInvite,
  hasBeenAlreadyInvited,
};
