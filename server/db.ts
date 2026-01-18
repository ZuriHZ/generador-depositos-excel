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
import { ENV } from "./_core/env";

const { Pool } = pg;

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL?.includes("localhost")
          ? false
          : { rejectUnauthorized: false },
      });
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
      email: user.email,
    };
    const updateSet: Record<string, any> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      (values as any)[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // PostgreSQL specific On Conflict Update
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

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
