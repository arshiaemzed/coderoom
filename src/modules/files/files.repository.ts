import type { RoomFile } from "../rooms/rooms.type.js";
import db from "../../infrastructure/postgres/pool.js";

async function uploadFile(
  userId: string,
  roomId: string,
  fileName: string,
  content: string,
): Promise<RoomFile | undefined> {
  const query = await db.query(
    `
    INSERT INTO room_files 
      (room_id, file_name, content, uploaded_by)
    VALUES($1, $2, $3, $4)
    RETURNING 
      id, 
      room_id AS "roomId",
      file_name AS "fileName",
      content,
      created_at AS "createdAt",
      updated_at AS "updatedAt";
    `,
    [roomId, fileName, content, userId],
  );

  const result = query.rows[0];

  return result;
}

export default {
  uploadFile,
};
