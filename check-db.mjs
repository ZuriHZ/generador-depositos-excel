import { readFileSync } from "node:fs";
import { Pool } from "pg";

const env = readFileSync(".env", "utf-8");
const line = env.split("\n").find(l => l.startsWith("DATABASE_URL="));
const url = line.split("=").slice(1).join("=").trim();

const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

pool
  .query('SELECT id, "clerkId", email, role FROM users')
  .then(r => {
    console.log("USERS:", JSON.stringify(r.rows));
    return pool.end();
  })
  .catch(e => {
    console.error("ERROR:", e.message);
    process.exit(1);
  });
