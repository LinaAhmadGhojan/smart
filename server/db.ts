import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Debug: log if DATABASE_URL is available
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ DATABASE_URL not found in environment variables!");
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes('DB') || k.includes('PG')));
  process.exit(1);
}

const sql = neon(dbUrl);
export const db = drizzle(sql);
