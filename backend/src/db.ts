import { Pool } from "pg";
import type { Device } from "./types.js";
import { config } from "./config.js";

const pool = config.databaseUrl
  ? new Pool({ connectionString: config.databaseUrl, max: 10, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000 })
  : null;

pool?.on("error", (error) => console.error("Unexpected PostgreSQL pool error", error));

export async function initializeDatabase(seed: Device[]) {
  if (!pool) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS gateways (
    id text PRIMARY KEY, name text NOT NULL, building_id text NOT NULL, building_name text NOT NULL,
    latitude double precision NOT NULL, longitude double precision NOT NULL, created_at timestamptz DEFAULT now()
  )`);
  const query = `INSERT INTO gateways (id,name,building_id,building_name,latitude,longitude)
    VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`;
  for (const d of seed) await pool.query(query, [d.id, d.name, d.buildingId, d.buildingName, d.latitude, d.longitude]);
}

export async function closeDatabase() { await pool?.end(); }
