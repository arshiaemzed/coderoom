import db from "../../infrastructure/postgres/pool.js";
import type { DatabaseRoomMember } from "./member.type.js";

async function kickMember(
  roomId: string,
  targetId: string,
): Promise<DatabaseRoomMember> {
  const query = await db.query(
    `
      DELETE FROM room_members 
      WHERE
        room_id = $1
        AND 
        user_id = $2 
      RETURNING
        id,
        user_id AS "userId",
        room_id AS "roomId",
        created_at AS "createdAt";
    `,
    [roomId, targetId],
  );

  return query.rows[0];
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

export default {
  kickMember,
  checkMembership,
};
