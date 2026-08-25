import { Pool } from "pg";

const testDatabase = new Pool({
  max: 5,
  database: process.env.TEST_DATABASE_NAME,
  host: process.env.TEST_DATABASE_HOST,
  port: Number(process.env.TEST_DATABASE_PORT),
  user: process.env.TEST_DATABASE_USER,
  password: process.env.TEST_DATAPASE_PASSWORD,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
});

export default testDatabase;
