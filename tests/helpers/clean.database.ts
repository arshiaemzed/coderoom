import db from "../test.db.pool";
async function cleanDatabase() {
  await db.query("TRUNCATE invites");
  await db.query("TRUNCATE room_files");
  await db.query("TRUNCATE room_members");
  await db.query("TRUNCATE rooms");
  await db.query("TRUNCATE user_sessions");
  await db.query("TRUNCATE profiles");
  await db.query("TRUNCATE users");
}

export default cleanDatabase;
