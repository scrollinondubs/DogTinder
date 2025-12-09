import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Use Turso in production, local SQLite file in development
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

const client = tursoUrl && tursoToken
  ? createClient({ url: tursoUrl, authToken: tursoToken })
  : createClient({ url: "file:local.db" });

export const db = drizzle(client, { schema });

// Export schema for convenience
export * from "./schema";
