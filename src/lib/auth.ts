import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getMigrations } from "better-auth/db/migration";
import Database from "better-sqlite3";
import { MongoClient } from "mongodb";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const globalForDatabase = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
  sqliteDatabase?: Database.Database;
  authMigrations?: Promise<void>;
};

export function isAuthConfigured() {
  return Boolean(
    process.env.BETTER_AUTH_SECRET &&
      (process.env.MONGODB_URI || !process.env.VERCEL),
  );
}

export function getAuth() {
  const uri = process.env.MONGODB_URI;
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("Authentication is not configured. Set BETTER_AUTH_SECRET.");
  }

  if (process.env.VERCEL && !uri) {
    throw new Error(
      "Authentication on Vercel requires MONGODB_URI and BETTER_AUTH_SECRET.",
    );
  }

  let database: ReturnType<typeof mongodbAdapter> | Database.Database;
  if (uri) {
    const client =
      globalForDatabase.mongoClient ?? new MongoClient(uri, { maxPoolSize: 10 });
    globalForDatabase.mongoClient = client;
    database = mongodbAdapter(client.db(), { client });
  } else {
    const databaseDirectory = join(process.cwd(), ".data");
    mkdirSync(databaseDirectory, { recursive: true });
    const databasePath = join(databaseDirectory, "auth.sqlite");
    const sqlite =
      globalForDatabase.sqliteDatabase ??
      new Database(databasePath, { timeout: 5000 });
    globalForDatabase.sqliteDatabase = sqlite;
    database = sqlite;
  }

  const socialProviders = {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  };

  return betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret,
    database,
    emailAndPassword: { enabled: true },
    socialProviders,
    user: { changeEmail: { enabled: false } },
  });
}

export async function getReadyAuth() {
  const auth = getAuth();
  if (process.env.MONGODB_URI) {
    return auth;
  }

  globalForDatabase.authMigrations ??= getMigrations(auth.options).then(
    async ({ runMigrations }) => runMigrations(),
  );
  await globalForDatabase.authMigrations;

  return auth;
}
