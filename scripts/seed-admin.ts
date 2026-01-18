import "dotenv/config";
import { getDb } from "../server/db";
import { users } from "../drizzle/schema";
import bcrypt from "bcryptjs";

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("No database connection");
    process.exit(1);
  }

  const email = "admin@example.com";
  const password = "admin";
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Creating admin user: ${email}`);

  try {
    await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
        openId: `manual:${email}`,
        loginMethod: "manual",
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          password: hashedPassword,
          role: "admin",
          updatedAt: new Date(),
        },
      });

    console.log("Admin user created/updated successfully");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    process.exit(0);
  }
}

seed();
