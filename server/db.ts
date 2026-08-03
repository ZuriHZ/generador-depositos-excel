import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  InsertUser,
  users,
  deposits,
  InsertDepositInput,
  Deposit,
} from "../drizzle/schema";

const { Pool } = pg;

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        // Neon requires SSL with proper certificate validation
        ssl: process.env.DATABASE_URL?.includes("localhost") ? false : true,
        // Keep connections alive for serverless
        idleTimeoutMillis: 60_000,
      });
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User Operations ────────────────────────────────────────────────

/**
 * Find a user by their Clerk ID (primary auth identifier).
 */
export async function getUserByClerkId(clerkId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Find a user by their email address.
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create or update a user based on their Clerk ID.
 * Called on every authenticated request to keep user data in sync with Clerk.
 */
export async function upsertUser(user: {
  clerkId: string;
  email: string;
  name?: string | null;
  role?: "user" | "admin";
}): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      clerkId: user.clerkId,
      email: user.email,
      name: user.name ?? null,
      role: user.role ?? "user",
      lastSignedIn: new Date(),
    };

    const updateSet: Record<string, any> = {
      email: user.email,
      lastSignedIn: new Date(),
      updatedAt: new Date(),
    };

    if (user.name != null) {
      updateSet.name = user.name;
    }

    // Don't overwrite role on upsert — only set it on first creation
    // Admin role should be set manually via DB or a separate admin endpoint

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.clerkId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

// ─── Deposit Operations ─────────────────────────────────────────────

export async function createDeposit(
  userId: number,
  data: InsertDepositInput
): Promise<Deposit> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const [inserted] = await db
    .insert(deposits)
    .values({
      ...data,
      userId,
    })
    .returning();

  return inserted;
}

export async function getDepositsByUserId(userId: number): Promise<Deposit[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(deposits).where(eq(deposits.userId, userId));
}

export async function updateDeposit(
  depositId: number,
  data: Partial<InsertDepositInput>
): Promise<Deposit> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // PostgreSQL allows returning directly
  const [updated] = await db
    .update(deposits)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(deposits.id, depositId))
    .returning();

  if (!updated) {
    throw new Error("Deposit not found");
  }
  return updated;
}

export async function deleteDeposit(depositId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(deposits).where(eq(deposits.id, depositId));
}
