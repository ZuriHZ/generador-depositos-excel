import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, foreignKey } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here
export const deposits = mysqlTable(
  "deposits",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId"),
    fecha: varchar("fecha", { length: 10 }).notNull(),
    numeroCuenta: varchar("numeroCuenta", { length: 50 }).notNull(),
    nombreCliente: text("nombreCliente").notNull(),
    monto: decimal("monto", { precision: 12, scale: 2 }).notNull(),
    tipoDeposito: varchar("tipoDeposito", { length: 50 }).notNull(),
    remito: varchar("remito", { length: 50 }),
    numeroBolsa: varchar("numeroBolsa", { length: 50 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  ]
);

export type Deposit = typeof deposits.$inferSelect;
export type InsertDepositInput = Omit<typeof deposits.$inferInsert, 'userId'>;
export type InsertDeposit = typeof deposits.$inferInsert;
