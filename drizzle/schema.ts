import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
  foreignKey,
  serial,
} from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(), // Made optional for manual users
  name: text("name"),
  email: varchar("email", { length: 320 }).notNull().unique(), // Email is now mandatory and unique
  password: text("password"), // New field for manual login
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: text("role", { enum: ["user", "admin"] })
    .default("user")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const deposits = pgTable(
  "deposits",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId"),
    fecha: varchar("fecha", { length: 10 }).notNull(),
    numeroCuenta: varchar("numeroCuenta", { length: 50 }).notNull(),
    nombreCliente: text("nombreCliente").notNull(),
    monto: decimal("monto", { precision: 12, scale: 2 }).notNull(),
    tipoDeposito: varchar("tipoDeposito", { length: 50 }).notNull(),
    remito: varchar("remito", { length: 50 }),
    numeroBolsa: varchar("numeroBolsa", { length: 50 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  table => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
  ]
);

export type Deposit = typeof deposits.$inferSelect;
export type InsertDepositInput = Omit<typeof deposits.$inferInsert, "userId">;
export type InsertDeposit = typeof deposits.$inferInsert;
