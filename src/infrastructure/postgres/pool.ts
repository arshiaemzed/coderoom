import "dotenv/config";
import { Pool, type PoolConfig } from "pg";

const poolConfig: PoolConfig = {
  max: 5,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(poolConfig);

export default pool;
