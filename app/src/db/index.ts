import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// For local development, use SQLite
// For production (Turso), you would use @libsql/client instead
const sqlite = new Database("local.db");

export const db = drizzle(sqlite, { schema });

// Export schema for convenience
export * from "./schema";
