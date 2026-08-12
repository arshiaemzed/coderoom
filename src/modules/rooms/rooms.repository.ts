import type { Room } from "./rooms.type.js";
import db from "../../infrastructure/postgres/pool.js";

async function createRoom(
  userId: string,
  name: string | undefined,
): Promise<Room> {
  const query = await db.query<Room>(
    `
        INSERT INTO rooms
            (user_id, name)    
        VALUES($1, $2)
        RETURNING 
            id,
            user_id AS "userId",
            name,
            created_at AS "createdAt";
    `,
    [userId, name ?? "Unnamed room"],
  );

  const result = query.rows[0];

  if (!result) {
    throw new Error("Failed to create room.");
  }

  return result;
}

async function doesRoomExists(roomId: string): Promise<Room | undefined> {
  const query = await db.query("SELECT id FROM rooms WHERE id = $1", [roomId]);

  const result = query.rows[0];

  return result;
}

async function isOwnerOfTheRoom(
  roomId: string,
  userId: string,
): Promise<boolean> {
  const query = await db.query(
    "SELECT id FROM rooms WHERE id = $1 AND user_id = $2",
    [roomId, userId],
  );

  const isOwner = query.rowCount === null ? false : query.rowCount > 0;

  return isOwner;
}

async function deleteRoom(
  roomId: string,
  userId: string,
): Promise<Room | undefined> {
  const query = await db.query(
    `
    DELETE FROM rooms
     WHERE 
      id = $1 
      AND 
      user_id = $2 
    RETURNING 
      id,
      user_id AS "userId",
      name,
      created_at AS "createdAt";
    `,
    [roomId, userId],
  );

  const result = query.rows[0];

  return result;
}

export default {
  createRoom,
  deleteRoom,
  doesRoomExists,
  isOwnerOfTheRoom,
};
