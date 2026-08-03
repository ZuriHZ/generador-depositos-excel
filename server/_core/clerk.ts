/**
 * Clerk authentication middleware and helpers for Express.
 *
 * This module wraps @clerk/express to provide:
 * - `clerkMiddleware()` — Express middleware that attaches auth to every request
 * - `getAuth(req)` — Extract auth info from an authenticated request
 * - `clerkClient` — Server-side Clerk API client for user lookups
 */
import { clerkClient, clerkMiddleware, getAuth } from "@clerk/express";

export { clerkClient, clerkMiddleware, getAuth };
