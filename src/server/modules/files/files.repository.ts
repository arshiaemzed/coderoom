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

async function getSpecificFile(fileId: string): Promise<File | undefined> {
  const query = await db.query(
    `
      SELECT 
        id,
        room_id AS "roomId",
        file_name AS "fileName",
        content,
        uploaded_by AS "uploadedBy",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM room_files 
      WHERE id = $1;
    `,
    [fileId],
  );

  return query.rows[0];
}

async function getRoomFiles(roomId: string): Promise<Array<RoomFile>> {
  const query = await db.query(
    `
    SELECT 
      id,
      room_id AS "roomId",
      file_name AS "fileName",
      content,
      uploaded_by AS "uploadedBy",
      created_at AS "createdAt",
      updated_at AS "updatedAt" 
      FROM room_files 
    WHERE 
      room_id = $1;    
    `,
    [roomId],
  );

  return query.rows;
}

export default {
  uploadFile,
  getSpecificFile,
  getRoomFiles,
};
