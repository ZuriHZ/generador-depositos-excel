import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getAuth, clerkClient } from "./clerk";
import { getUserByClerkId, upsertUser } from "../db";
import { ENV } from "./env";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// Solo estos emails pueden usar la app (allowlist, app de un solo usuario).
const allowedEmails = ENV.allowedUserEmails
  .split(",")
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

function isAllowedEmail(email: string): boolean {
  return allowedEmails.includes(email.toLowerCase());
}

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

          if (!isAllowedEmail(email)) {
            console.warn(
              `[Auth] Rejected sign-in from non-allowed email: ${email} (${auth.userId})`
            );
            user = null;
          } else {
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
          }
        } catch (clerkError) {
          console.error(
            "[Auth] Failed to fetch/create user from Clerk:",
            clerkError
          );
        }
      } else if (isAllowedEmail(user.email)) {
        // Existing user — update lastSignedIn
        await upsertUser({
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
        });
      } else {
        console.warn(
          `[Auth] Rejected existing user with non-allowed email: ${user.email} (${auth.userId})`
        );
        user = null;
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
