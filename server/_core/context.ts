import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getAuth, clerkClient } from "./clerk";
import { getUserByClerkId, upsertUser } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const auth = getAuth(opts.req);

    if (auth?.userId) {
      // Look up user in our database
      user = (await getUserByClerkId(auth.userId)) ?? null;

      if (!user) {
        // First login — auto-create user from Clerk data
        try {
          const clerkUser = await clerkClient.users.getUser(auth.userId);
          const email =
            clerkUser.emailAddresses?.[0]?.emailAddress ?? "unknown@example.com";
          const name =
            [clerkUser.firstName, clerkUser.lastName]
              .filter(Boolean)
              .join(" ") || null;

          await upsertUser({
            clerkId: auth.userId,
            email,
            name,
          });

          user = (await getUserByClerkId(auth.userId)) ?? null;
        } catch (clerkError) {
          console.error(
            "[Auth] Failed to fetch/create user from Clerk:",
            clerkError
          );
        }
      } else {
        // Existing user — update lastSignedIn
        await upsertUser({
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
        });
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
