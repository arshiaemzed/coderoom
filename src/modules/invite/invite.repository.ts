import db from "../../infrastructure/postgres/pool.js";
import type { InvitedUser, RoomMember } from "./invite.type.js";

async function checkForInvite(
  roomId: string,
  userId: string,
): Promise<boolean> {
  const query = await db.query(
    `SELECT user_id FROM invites WHERE room_id = $1 AND user_id = $2`,
    [roomId, userId],
  );

  const result = query.rowCount == null ? false : query.rowCount > 0;

  return result;
}

async function checkMembership(
  roomId: string,
  userId: string,
): Promise<boolean> {
  const query = await db.query(
    "SELECT id FROM room_members WHERE user_id = $1 AND room_id = $2",
    [userId, roomId],
  );

  const result = query.rowCount === null ? false : query.rowCount > 0;

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

async function acceptInvite(
  roomId: string,
  userId: string,
): Promise<RoomMember> {
  const client = await db.connect();

  try {
    await client.query("BEGIN;");

    await client.query(
      `
        DELETE FROM invites WHERE room_id = $1 AND user_id = $2;
      `,
      [roomId, userId],
    );

    const result = await client.query(
      `
        INSERT INTO room_members 
        (user_id, room_id) 
          VALUES($1, $2)
        RETURNING
          id,
          user_id AS "userId",
          room_id AS "roomId";
      `,
      [userId, roomId],
    );

    await client.query("COMMIT;");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK;");
    throw err;
  } finally {
    await client.release();
  }
}

async function declineInvite(
  roomId: string,
  userId: string,
): Promise<InvitedUser> {
  const query = await db.query(
    `
    DELETE FROM invites
    WHERE 
      user_id = $1 
      AND 
      room_id = $2;
    RETURNING
      id,
      user_id AS "userId",
      room_id AS "roomId",
      invited_by AS "invitedBy",
      created_at AS "createdAt";
    `,
  );

  const result: InvitedUser = query.rows[0];

  return result;
}

export default {
  inviteUser,
  revokeInvite,
  checkForInvite,
  acceptInvite,
  declineInvite,
  checkMembership,
};
